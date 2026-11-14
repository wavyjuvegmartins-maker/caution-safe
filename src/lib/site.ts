// Where the sign-up and sign-in buttons go. Points at /soon until milestone 2
// ships /login; change it here and every button follows.
export const START_HREF = "/soon";
export const SIGN_IN_HREF = "/soon";

export const THEME_STORAGE_KEY = "cs-theme";

/** Runs before first paint (inline in <head>) so a saved theme never flashes the wrong colours. */
export const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
