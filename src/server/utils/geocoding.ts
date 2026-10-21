export async function getKecamatan(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { "User-Agent": "JelajahNusantaraApp/1.0" } }
    );
    const data = await response.json();
    // OSM Nominatim address structure for Indonesia usually has "district" as kecamatan
    return data.address?.district || null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
