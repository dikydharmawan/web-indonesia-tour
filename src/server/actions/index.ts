"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  authenticate,
  createSession,
  destroySession,
  getCurrentAdmin,
} from "@/server/auth";
import { isDatabaseConfigured } from "@/server/db";
import {
  deleteDestinationRow,
  deleteRouteRow,
  insertDestination,
  insertRoute,
  setRouteStatus,
  updateDestinationRow,
  updateRouteRow,
} from "@/server/data/mutations";
import { saveThemeSettings } from "@/server/data/theme";
import { normalizeHex } from "@/shared/theme";
import { getString } from "./form";
import { errorMessage, flashUrl, safeRedirectTarget } from "./messages";
import { parseDestinationForm } from "./destination-payload";
import {
  parseRouteForm,
  parseRouteItems,
  type RouteItemInput,
} from "./route-payload";
import { getKecamatan } from "@/server/utils/geocoding";

async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/login?next=/admin");
  return admin;
}

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ---------------------------------- Auth --------------------------------- */

export async function login(formData: FormData) {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const target = safeRedirectTarget(getString(formData, "next"));

  if (!email || !password) {
    redirect(flashUrl("/login", "error", "Email dan kata sandi wajib diisi."));
  }

  if (!isDatabaseConfigured()) {
    redirect("/admin");
  }

  const admin = await authenticate(email, password);
  if (!admin) {
    redirect(
      flashUrl("/login", "error", "Email atau kata sandi salah.") +
        `&next=${encodeURIComponent(target)}`,
    );
  }

  await createSession(admin.id);
  revalidateSite();
  redirect(target);
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

/* ------------------------------ Destinations ----------------------------- */

export async function createDestination(formData: FormData) {
  const path = "/admin/destinations/new";
  const payload = parseDestinationForm(formData);

  if (!payload.title || !payload.slug) {
    redirect(flashUrl(path, "error", "Judul dan slug wajib diisi."));
  }

  if (!payload.kecamatan && payload.lat && payload.lng) {
    payload.kecamatan = await getKecamatan(payload.lat, payload.lng);
  }

  await requireAdmin();
  try {
    await insertDestination(payload);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(
    flashUrl(
      "/admin/destinations",
      "saved",
      `Destinasi “${payload.title}” berhasil ditambahkan.`,
    ),
  );
}

export async function updateDestination(formData: FormData) {
  const id = getString(formData, "id");
  const path = `/admin/destinations/${id}/edit`;

  if (!id) {
    redirect(flashUrl("/admin/destinations", "error", "ID destinasi tidak valid."));
  }

  const payload = parseDestinationForm(formData);
  if (!payload.title || !payload.slug) {
    redirect(flashUrl(path, "error", "Judul dan slug wajib diisi."));
  }

  if (!payload.kecamatan && payload.lat && payload.lng) {
    payload.kecamatan = await getKecamatan(payload.lat, payload.lng);
  }

  await requireAdmin();
  try {
    await updateDestinationRow(id, payload);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(flashUrl(path, "saved", "Perubahan destinasi berhasil disimpan."));
}

export async function deleteDestination(formData: FormData) {
  const id = getString(formData, "id");
  const path = "/admin/destinations";

  if (!id) {
    redirect(flashUrl(path, "error", "ID destinasi tidak valid."));
  }

  await requireAdmin();
  try {
    await deleteDestinationRow(id);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(flashUrl(path, "saved", "Destinasi berhasil dihapus."));
}

/* --------------------------------- Routes -------------------------------- */

function parseItemsOrRedirect(formData: FormData, path: string): RouteItemInput[] {
  try {
    return parseRouteItems(formData);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }
}

export async function createRoute(formData: FormData) {
  const path = "/admin/routes/new";
  const payload = parseRouteForm(formData);

  if (!payload.title || !payload.slug) {
    redirect(flashUrl(path, "error", "Judul dan slug wajib diisi."));
  }

  const items = parseItemsOrRedirect(formData, path);

  await requireAdmin();
  try {
    await insertRoute(payload, items);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(
    flashUrl("/admin/routes", "saved", `Rute “${payload.title}” berhasil dibuat.`),
  );
}

export async function updateRoute(formData: FormData) {
  const id = getString(formData, "id");
  const path = `/admin/routes/${id}/edit`;

  if (!id) {
    redirect(flashUrl("/admin/routes", "error", "ID rute tidak valid."));
  }

  const payload = parseRouteForm(formData);
  if (!payload.title || !payload.slug) {
    redirect(flashUrl(path, "error", "Judul dan slug wajib diisi."));
  }

  const items = parseItemsOrRedirect(formData, path);

  await requireAdmin();
  try {
    await updateRouteRow(id, payload, items);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(flashUrl(path, "saved", "Perubahan rute berhasil disimpan."));
}

export async function deleteRoute(formData: FormData) {
  const id = getString(formData, "id");
  const path = "/admin/routes";

  if (!id) {
    redirect(flashUrl(path, "error", "ID rute tidak valid."));
  }

  await requireAdmin();
  try {
    await deleteRouteRow(id);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(flashUrl(path, "saved", "Rute berhasil dihapus."));
}

export async function toggleRouteStatus(formData: FormData) {
  const id = getString(formData, "id");
  const path = "/admin/routes";
  const nextStatus =
    getString(formData, "status") === "published" ? "published" : "draft";

  if (!id) {
    redirect(flashUrl(path, "error", "ID rute tidak valid."));
  }

  await requireAdmin();
  try {
    await setRouteStatus(id, nextStatus);
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(
    flashUrl(
      path,
      "saved",
      nextStatus === "published"
        ? "Rute berhasil diterbitkan."
        : "Rute dikembalikan ke draf.",
    ),
  );
}

/* --------------------------------- Theme --------------------------------- */

export async function saveTheme(formData: FormData) {
  const path = "/admin/settings";
  const brand = normalizeHex(getString(formData, "brand"));
  const accent = normalizeHex(getString(formData, "accent"));
  const ink = normalizeHex(getString(formData, "ink"));

  if (!brand || !accent || !ink) {
    redirect(
      flashUrl(path, "error", "Kode warna harus format hex, misalnya #0d9488."),
    );
  }

  await requireAdmin();
  try {
    await saveThemeSettings({ brand, accent, ink });
  } catch (error) {
    redirect(flashUrl(path, "error", errorMessage(error)));
  }

  revalidateSite();
  redirect(flashUrl(path, "saved", "Tema berhasil disimpan."));
}
