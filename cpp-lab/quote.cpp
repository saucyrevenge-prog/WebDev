// Soucy C++ WebAssembly demo. Entirely fictional input, no networking.
extern "C" __attribute__((visibility("default")))
int calculate_quote(int hours, int hourly_rate, int visits, int travel_fee, int tax_percent) {
  if (hours < 0 || hours > 100 || hourly_rate < 0 || hourly_rate > 500
      || visits < 0 || visits > 20 || travel_fee < 0 || travel_fee > 300
      || tax_percent < 0 || tax_percent > 30) return -1;
  int subtotal = (hours * hourly_rate + travel_fee) * visits;
  return subtotal * (100 + tax_percent); // cents
}
// Build: clang++ --target=wasm32 -nostdlib -O2 -Wl,--no-entry
//        -Wl,--export=calculate_quote -Wl,--strip-all -o quote.wasm quote.cpp
