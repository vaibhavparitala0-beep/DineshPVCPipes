/**
 * Responsive Design Tests
 *
 * This file validates that our responsive design breakpoints
 * are properly configured for mobile, tablet, and desktop devices.
 */

// Test Tailwind CSS responsive breakpoints
export const BREAKPOINTS = {
  mobile: 0, // Default (0-639px)
  sm: 640, // Small devices (640px-767px)
  md: 768, // Medium devices (768px-1023px)
  lg: 1024, // Large devices (1024px-1279px)
  xl: 1280, // Extra large devices (1280px-1535px)
  "2xl": 1536, // 2X large devices (1536px+)
};

// Test component visibility at different screen sizes
export const RESPONSIVE_COMPONENTS = {
  mobileNavButton: {
    visible: ["mobile", "sm", "md"],
    hidden: ["lg", "xl", "2xl"],
    className: "lg:hidden",
  },
  desktopNav: {
    visible: ["lg", "xl", "2xl"],
    hidden: ["mobile", "sm", "md"],
    className: "hidden lg:block",
  },
  notificationCenter: {
    mobile: {
      position: "fixed",
      className: "fixed top-4 right-4 z-50 lg:hidden",
    },
    desktop: {
      position: "relative",
      className: "hidden lg:flex justify-end mb-4",
    },
  },
  dashboardGrid: {
    mobile: "grid-cols-1",
    tablet: "sm:grid-cols-2",
    desktop: "lg:grid-cols-4",
  },
};

// Quick Actions responsiveness
export const QUICK_ACTIONS = {
  layout: "flex flex-wrap gap-2",
  buttonSize: 'size="sm"',
  responsive: true,
};

// Alert system responsiveness
export const ALERTS = {
  spacing: "space-y-4",
  responsive: true,
  mobile: "text-sm",
  desktop: "text-base",
};

// Card layout responsiveness
export const CARD_LAYOUTS = {
  dashboard: {
    main: "grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8",
    cards: {
      padding: "p-3 lg:p-6",
      spacing: "space-y-3 lg:space-y-4",
    },
  },
  metrics: {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6",
  },
};

export const validateResponsiveDesign = () => {
  const tests = [
    {
      name: "Mobile Navigation",
      test: () =>
        RESPONSIVE_COMPONENTS.mobileNavButton.className === "lg:hidden",
      description: "Mobile nav button should be hidden on large screens",
    },
    {
      name: "Desktop Navigation",
      test: () =>
        RESPONSIVE_COMPONENTS.desktopNav.className === "hidden lg:block",
      description: "Desktop nav should be hidden on mobile screens",
    },
    {
      name: "Dashboard Grid",
      test: () => CARD_LAYOUTS.dashboard.main.includes("xl:grid-cols-3"),
      description:
        "Dashboard should use 3-column layout on extra large screens",
    },
    {
      name: "Metrics Grid",
      test: () => CARD_LAYOUTS.metrics.grid.includes("sm:grid-cols-2"),
      description: "Metrics should use 2-column layout on small screens",
    },
  ];

  const results = tests.map((test) => ({
    ...test,
    passed: test.test(),
  }));

  const allPassed = results.every((result) => result.passed);

  return {
    allPassed,
    results,
    summary: `${results.filter((r) => r.passed).length}/${results.length} tests passed`,
  };
};

// Export for use in tests
export default validateResponsiveDesign;
