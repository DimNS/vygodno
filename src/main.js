import App from './App.svelte';
import { mount } from 'svelte';

let /** @type {App} */ app;

app = mount(App, {
    target: document.getElementById('app'),
});

export default app;
