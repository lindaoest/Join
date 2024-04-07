async function renderTemplates() {
	document.getElementById('header').innerHTML = await headerTemplate();
	document.getElementById('sidebar').innerHTML = await sidebarTemplate();
	document.getElementById('sidebar-mobile').innerHTML = await sidebarTemplateMobile();
}