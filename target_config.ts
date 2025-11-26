const target_tauri = true;

export const api_proxy_addr = "http://192.168.56.1:8000/api";
export const img_proxy_addr = "http://172.21.144.1:9000";

export const dest_api = target_tauri ? api_proxy_addr : "/api";
export const dest_img = target_tauri ? img_proxy_addr : "/img";
export const dest_root = target_tauri ? "" : "/";