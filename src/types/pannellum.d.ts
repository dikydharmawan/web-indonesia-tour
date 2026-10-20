// @types/pannellum hanya menyediakan deklarasi global (window.pannellum),
// bukan modul. Shim ini membuat import("pannellum") untuk side effect lolos
// type-check; API tetap diakses lewat window.pannellum yang bertipe.
declare module "pannellum";
