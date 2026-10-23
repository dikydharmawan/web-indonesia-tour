import Link from "next/link";
import ImageUrlField from "@/client/components/admin/ImageUrlField";
import SaveButton from "@/client/components/admin/SaveButton";
import { createDestination, updateDestination } from "@/server/actions";
import { getI18n } from "@/server/i18n";
import type { Destination } from "@/types/db";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500";

export default async function DestinationForm({
  destination,
  cancelHref,
}: {
  destination?: Destination | null;
  cancelHref: string;
}) {
  const { dict } = await getI18n();
  const t = dict.admin.form;
  const isEdit = Boolean(destination);
  const ticket = destination?.ticket_info;
  const hours = destination?.opening_hours;

  return (
    <form
      action={isEdit ? updateDestination : createDestination}
      className="space-y-6"
    >
      {destination && <input type="hidden" name="id" value={destination.id} />}

      <fieldset className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                {t.basicInfo}
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                {t.basicInfoDesc}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              {t.required}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className={labelClass}>
                {t.destinationName}
              </label>
              <input
                id="title"
                name="title"
                required
                defaultValue={destination?.title ?? ""}
                placeholder={t.destinationNamePlaceholder}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="slug" className={labelClass}>
                {t.slug}
              </label>
              <input
                id="slug"
                name="slug"
                defaultValue={destination?.slug ?? ""}
                placeholder="candi-borobudur"
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                {t.slugHint}
              </p>
            </div>

            <div>
              <label htmlFor="category" className={labelClass}>
                {t.category}
              </label>
              <input
                id="category"
                name="category"
                list="category-options"
                defaultValue={destination?.category ?? ""}
                placeholder={t.categoryPlaceholder}
                className={inputClass}
              />
              <datalist id="category-options">
                <option value="Budaya" />
                <option value="Alam" />
                <option value="Belanja" />
                <option value="Kuliner" />
                <option value="Sejarah" />
              </datalist>
            </div>

            <div>
              <label htmlFor="city" className={labelClass}>
                {t.city}
              </label>
              <input
                id="city"
                name="city"
                defaultValue={destination?.city ?? ""}
                placeholder="Magelang"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="kecamatan" className={labelClass}>
                {t.district}
              </label>
              <input
                id="kecamatan"
                name="kecamatan"
                defaultValue={destination?.kecamatan ?? ""}
                placeholder="Borobudur"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                {t.description}
              </label>
              <textarea
                id="description"
                name="description"
                rows={7}
                defaultValue={destination?.description ?? ""}
                placeholder={t.descriptionPlaceholder}
                className={`${inputClass} resize-y leading-relaxed`}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {t.media}
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            {t.mediaDesc}
          </p>

          <div className="mt-5 space-y-6">
            <ImageUrlField
              name="cover_image"
              label={t.cover}
              defaultValue={destination?.cover_image}
              bucket="covers"
              hint={t.coverHint}
            />
            <div className="border-t border-slate-100 pt-6">
              <ImageUrlField
                name="panorama_url"
                label={t.panorama}
                defaultValue={destination?.panorama_url}
                bucket="panoramas"
                aspect="aspect-[2/1]"
                hint={t.panoramaHint}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {t.location}
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            {t.locationDesc}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="lat" className={labelClass}>
                {t.latitude}
              </label>
              <input
                id="lat"
                name="lat"
                type="number"
                step="any"
                min={-90}
                max={90}
                defaultValue={destination?.lat ?? ""}
                placeholder="-7.607874"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lng" className={labelClass}>
                {t.longitude}
              </label>
              <input
                id="lng"
                name="lng"
                type="number"
                step="any"
                min={-180}
                max={180}
                defaultValue={destination?.lng ?? ""}
                placeholder="110.203885"
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            {t.visitInfo}
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            {t.visitInfoDesc}
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="ticket_adult" className={labelClass}>
                {t.ticketAdult}
              </label>
              <input
                id="ticket_adult"
                name="ticket_adult"
                type="number"
                min={0}
                step={1000}
                defaultValue={ticket?.adult ?? ""}
                placeholder="50000"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ticket_child" className={labelClass}>
                {t.ticketChild}
              </label>
              <input
                id="ticket_child"
                name="ticket_child"
                type="number"
                min={0}
                step={1000}
                defaultValue={ticket?.child ?? ""}
                placeholder="25000"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="ticket_vehicle" className={labelClass}>
                {t.ticketVehicle}
              </label>
              <input
                id="ticket_vehicle"
                name="ticket_vehicle"
                type="number"
                min={0}
                step={1000}
                defaultValue={ticket?.vehicle ?? ""}
                placeholder="10000"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="ticket_notes" className={labelClass}>
                {t.ticketNotes}
              </label>
              <input
                id="ticket_notes"
                name="ticket_notes"
                defaultValue={
                  typeof ticket?.notes === "string" ? ticket.notes : ""
                }
                placeholder={t.ticketNotesPlaceholder}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-3 border-t border-slate-100 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="hours_open" className={labelClass}>
                    {t.hoursOpen}
                  </label>
                  <input
                    id="hours_open"
                    name="hours_open"
                    defaultValue={hours?.open ?? ""}
                    placeholder="08:00"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="hours_close" className={labelClass}>
                    {t.hoursClose}
                  </label>
                  <input
                    id="hours_close"
                    name="hours_close"
                    defaultValue={hours?.close ?? ""}
                    placeholder="17:00"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="hours_days" className={labelClass}>
                {t.hoursDays}
              </label>
              <input
                id="hours_days"
                name="hours_days"
                defaultValue={hours?.days?.join(", ") ?? ""}
                placeholder={t.hoursDaysPlaceholder}
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                {t.hoursDaysHint}
              </p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="hours_notes" className={labelClass}>
                {t.hoursNotes}
              </label>
              <input
                id="hours_notes"
                name="hours_notes"
                defaultValue={
                  typeof hours?.notes === "string" ? hours.notes : ""
                }
                placeholder={t.hoursNotesPlaceholder}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-3 border-t border-slate-100 pt-4">
              <label htmlFor="facilities" className={labelClass}>
                {t.facilities}
              </label>
              <input
                id="facilities"
                name="facilities"
                defaultValue={destination?.facilities?.join(", ") ?? ""}
                placeholder={t.facilitiesPlaceholder}
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-slate-500">
                {t.facilitiesHint}
              </p>
            </div>
          </div>
        </section>
      </fieldset>

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">
        <p className="text-xs text-slate-500">
          {t.saveNote}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={cancelHref}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:bg-slate-50"
          >
            {dict.admin.common.cancel}
          </Link>
          <SaveButton
            label={isEdit ? t.saveChanges : t.addDestinationAction}
          />
        </div>
      </div>
    </form>
  );
}
