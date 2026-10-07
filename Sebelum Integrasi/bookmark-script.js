function filterCategory(selectedTab) {
  const allTabs = document.querySelectorAll('.tab-item');

  allTabs.forEach(tab => {
    tab.classList.remove('active');
  });

  selectedTab.classList.add('active');
}