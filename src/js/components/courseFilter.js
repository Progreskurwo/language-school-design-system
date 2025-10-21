/**
 * Course Filter Component
 * 
 * Interactive filtering system for language courses with accessibility support.
 * Supports filtering by level, language, format, schedule, and price range.
 */

class CourseFilter {
  constructor(options = {}) {
    this.options = {
      containerSelector: '.course-filter-container',
      courseSelector: '.course-card',
      filterSelector: '.filter-btn',
      activeClass: 'active',
      hiddenClass: 'hidden',
      animationDuration: 300,
      ...options
    };
    
    this.filters = {
      level: 'all',
      language: 'all',
      format: 'all',
      schedule: 'all',
      price: 'all'
    };
    
    this.courses = [];
    this.filteredCourses = [];
    
    this.init();
  }
  
  /**
   * Initialize the course filter system
   */
  init() {
    this.bindEvents();
    this.loadCourses();
    this.setupAccessibility();
    this.renderCourses();
    
    // Announce to screen readers
    this.announceToScreenReader('Course filter initialized. Use filter buttons to refine results.');
  }
  
  /**
   * Bind event listeners
   */
  bindEvents() {
    // Filter button clicks
    document.addEventListener('click', (e) => {
      if (e.target.matches(this.options.filterSelector)) {
        e.preventDefault();
        this.handleFilterClick(e.target);
      }
    });
    
    // Keyboard navigation for filters
    document.addEventListener('keydown', (e) => {
      if (e.target.matches(this.options.filterSelector)) {
        this.handleFilterKeydown(e);
      }
    });
    
    // Search input (if exists)
    const searchInput = document.querySelector('.course-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', this.debounce((e) => {
        this.handleSearch(e.target.value);
      }, 300));
    }
    
    // Clear all filters
    const clearButton = document.querySelector('.clear-filters-btn');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
  }
  
  /**
   * Handle filter button clicks
   */
  handleFilterClick(button) {
    const filterType = button.dataset.filter;
    const filterValue = button.dataset.value;
    
    if (!filterType || !filterValue) return;
    
    this.updateFilter(filterType, filterValue);
    this.updateActiveButtons(filterType, button);
    this.renderCourses();
    
    // Accessibility: announce filter change
    const coursesCount = this.filteredCourses.length;
    this.announceToScreenReader(
      `Filter applied: ${button.textContent}. Showing ${coursesCount} course${coursesCount !== 1 ? 's' : ''}.`
    );
  }
  
  /**
   * Handle keyboard navigation for filters
   */
  handleFilterKeydown(e) {
    const filterGroup = e.target.closest('.filter-group');
    if (!filterGroup) return;
    
    const buttons = Array.from(filterGroup.querySelectorAll(this.options.filterSelector));
    const currentIndex = buttons.indexOf(e.target);
    let targetIndex;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        targetIndex = (currentIndex + 1) % buttons.length;
        buttons[targetIndex].focus();
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        targetIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        buttons[targetIndex].focus();
        break;
        
      case 'Home':
        e.preventDefault();
        buttons[0].focus();
        break;
        
      case 'End':
        e.preventDefault();
        buttons[buttons.length - 1].focus();
        break;
    }
  }
  
  /**
   * Update filter value
   */
  updateFilter(type, value) {
    this.filters[type] = value;
    this.applyFilters();
  }
  
  /**
   * Apply all active filters
   */
  applyFilters() {
    this.filteredCourses = this.courses.filter(course => {
      return Object.entries(this.filters).every(([filterType, filterValue]) => {
        if (filterValue === 'all') return true;
        
        const courseValue = course.dataset[filterType] || course.getAttribute(`data-${filterType}`);
        
        // Handle multiple values (e.g., "beginner,intermediate")
        if (courseValue && courseValue.includes(',')) {
          return courseValue.split(',').map(v => v.trim()).includes(filterValue);
        }
        
        return courseValue === filterValue;
      });
    });
  }
  
  /**
   * Handle search functionality
   */
  handleSearch(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.applyFilters();
    } else {
      this.filteredCourses = this.filteredCourses.filter(course => {
        const title = course.querySelector('.course-title')?.textContent.toLowerCase() || '';
        const description = course.querySelector('.course-description')?.textContent.toLowerCase() || '';
        const tags = course.dataset.tags?.toLowerCase() || '';
        
        return title.includes(term) || description.includes(term) || tags.includes(term);
      });
    }
    
    this.renderCourses();
    
    // Update search results count
    const resultsCount = document.querySelector('.search-results-count');
    if (resultsCount) {
      const count = this.filteredCourses.length;
      resultsCount.textContent = `${count} course${count !== 1 ? 's' : ''} found`;
    }
  }
  
  /**
   * Load all course elements
   */
  loadCourses() {
    this.courses = Array.from(document.querySelectorAll(this.options.courseSelector));
    this.filteredCourses = [...this.courses];
  }
  
  /**
   * Render filtered courses with animation
   */
  renderCourses() {
    // Hide all courses first
    this.courses.forEach(course => {
      if (this.filteredCourses.includes(course)) {
        this.showCourse(course);
      } else {
        this.hideCourse(course);
      }
    });
    
    // Update results count
    this.updateResultsCount();
    
    // Show empty state if no results
    this.toggleEmptyState();
    
    // Trigger custom event
    document.dispatchEvent(new CustomEvent('coursesFiltered', {
      detail: {
        courses: this.filteredCourses,
        filters: this.filters,
        count: this.filteredCourses.length
      }
    }));
  }
  
  /**
   * Show course with animation
   */
  showCourse(course) {
    course.style.display = 'block';
    course.classList.remove(this.options.hiddenClass);
    
    // Trigger reflow for animation
    course.offsetHeight;
    
    course.style.opacity = '1';
    course.style.transform = 'translateY(0)';
  }
  
  /**
   * Hide course with animation
   */
  hideCourse(course) {
    course.style.opacity = '0';
    course.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      if (course.style.opacity === '0') {
        course.style.display = 'none';
        course.classList.add(this.options.hiddenClass);
      }
    }, this.options.animationDuration);
  }
  
  /**
   * Update active button states
   */
  updateActiveButtons(filterType, activeButton) {
    const filterGroup = activeButton.closest('.filter-group');
    if (!filterGroup) return;
    
    // Remove active class from siblings
    filterGroup.querySelectorAll(this.options.filterSelector)
      .forEach(btn => btn.classList.remove(this.options.activeClass));
    
    // Add active class to clicked button
    activeButton.classList.add(this.options.activeClass);
    
    // Update aria-pressed for accessibility
    filterGroup.querySelectorAll(this.options.filterSelector)
      .forEach(btn => btn.setAttribute('aria-pressed', 'false'));
    activeButton.setAttribute('aria-pressed', 'true');
  }
  
  /**
   * Update results count display
   */
  updateResultsCount() {
    const countElement = document.querySelector('.filter-results-count');
    if (countElement) {
      const count = this.filteredCourses.length;
      const total = this.courses.length;
      countElement.textContent = `Showing ${count} of ${total} courses`;
    }
  }
  
  /**
   * Toggle empty state display
   */
  toggleEmptyState() {
    const emptyState = document.querySelector('.courses-empty-state');
    if (!emptyState) return;
    
    if (this.filteredCourses.length === 0) {
      emptyState.style.display = 'block';
      emptyState.setAttribute('aria-hidden', 'false');
    } else {
      emptyState.style.display = 'none';
      emptyState.setAttribute('aria-hidden', 'true');
    }
  }
  
  /**
   * Clear all active filters
   */
  clearAllFilters() {
    // Reset all filters to 'all'
    Object.keys(this.filters).forEach(key => {
      this.filters[key] = 'all';
    });
    
    // Reset all filter buttons
    document.querySelectorAll(this.options.filterSelector).forEach(btn => {
      btn.classList.remove(this.options.activeClass);
      btn.setAttribute('aria-pressed', 'false');
    });
    
    // Activate 'all' buttons
    document.querySelectorAll('[data-value="all"]').forEach(btn => {
      btn.classList.add(this.options.activeClass);
      btn.setAttribute('aria-pressed', 'true');
    });
    
    // Clear search input
    const searchInput = document.querySelector('.course-search-input');
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Reset courses
    this.filteredCourses = [...this.courses];
    this.renderCourses();
    
    this.announceToScreenReader('All filters cleared. Showing all courses.');
  }
  
  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Add ARIA labels and roles
    document.querySelectorAll('.filter-group').forEach(group => {
      const legend = group.querySelector('.filter-legend');
      if (legend) {
        const groupId = `filter-group-${Math.random().toString(36).substr(2, 9)}`;
        group.setAttribute('role', 'group');
        group.setAttribute('aria-labelledby', groupId);
        legend.id = groupId;
      }
    });
    
    // Setup filter buttons
    document.querySelectorAll(this.options.filterSelector).forEach(btn => {
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-pressed', btn.classList.contains(this.options.activeClass) ? 'true' : 'false');
      
      if (!btn.hasAttribute('tabindex')) {
        btn.setAttribute('tabindex', '0');
      }
    });
    
    // Add live region for announcements
    if (!document.querySelector('#course-filter-announcements')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'course-filter-announcements';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(liveRegion);
    }
  }
  
  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message) {
    const liveRegion = document.querySelector('#course-filter-announcements');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }
  
  /**
   * Debounce utility function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Get current filter state
   */
  getFilters() {
    return { ...this.filters };
  }
  
  /**
   * Get filtered courses
   */
  getFilteredCourses() {
    return [...this.filteredCourses];
  }
  
  /**
   * Programmatically set filters
   */
  setFilters(newFilters) {
    Object.assign(this.filters, newFilters);
    this.applyFilters();
    this.renderCourses();
    
    // Update button states
    Object.entries(newFilters).forEach(([filterType, filterValue]) => {
      const button = document.querySelector(`[data-filter="${filterType}"][data-value="${filterValue}"]`);
      if (button) {
        this.updateActiveButtons(filterType, button);
      }
    });
  }
  
  /**
   * Destroy the filter instance
   */
  destroy() {
    // Remove event listeners would require tracking them
    // For now, just clear the courses
    this.courses = [];
    this.filteredCourses = [];
    
    // Remove live region
    const liveRegion = document.querySelector('#course-filter-announcements');
    if (liveRegion) {
      liveRegion.remove();
    }
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CourseFilter;
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.course-filter-container')) {
      window.courseFilter = new CourseFilter();
    }
  });
} else {
  if (document.querySelector('.course-filter-container')) {
    window.courseFilter = new CourseFilter();
  }
}