Your task is to implement a new route on /dashboard, following the design + development brief below. Implement thoroughly, in a step-by-step manner, and use built-in, standard Tailwind CSS design tokens instead of hardcoding values.

For colors and font families, use the defined values present in

@tailwind.config.js, e.g. 'bg-primary-500' etc. instead of the hardcoded primary/secondary values in the JSON brief. For one-off colors/grays etc. the JSON values are acceptable.


**Requirements**

- responsive (full width bg with centered content on larger screens)

- theme aware components with light and dark mode support (you can toggle with @ThemeSwitch.tsx; make sure to include that in the menu bar)

 - update @data/config/colors.js to match the colors in the design brief

 - *important* make sure to include light and dark mode colors by using Tailwind's dark mode classes (dark:)

 - all components must adapt to theme changes

- *do not use* magic strings, hex values, or px values. Replace all with Tailwind classes if possible.

- split reusable or complex parts of the UI into components so the code is maintainable and easy to understand.

- if any sample data is generated, place it in a separate file to keep the code clean.

**Note**

- the app is already running a dev server

**Assignment brief**

Design and implement the TeachLens interface as a clean dashboard inspired by modern analytics and learning management systems. The layout should include a persistent left navigation sidebar, a top toolbar for global actions, and a spacious content canvas for dashboards, class analytics, and teaching insights.

Use a calm visual tone appropriate for educators: clean surfaces, moderate information density, and strong visual hierarchy. Metric cards should highlight class indicators like average score, participation rate, and confidence levels. Charts and visualizations should emphasize teaching insights and learning patterns.

Assessment entry should appear as a focused form workflow with simple fields: assessment title, date, topic or concept, average score, confidence, participation rate, teaching method used, and teacher observations. Forms should be easy to complete quickly, with minimal friction.

Use two primary color palettes: a primary academic blue palette and a secondary teal palette. All other UI surfaces should rely on neutral gray scales. Accent colors may be used for status indicators like success, warning, or alerts. Charts and gradients can use blends of the primary and secondary palette.

Support both light and dark themes. Light mode should prioritize soft white cards and subtle borders. Dark mode should rely on deep neutral backgrounds with elevated cards and readable text contrast.

Spacing should feel breathable and consistent. Components should use soft rounded corners and subtle shadows to separate layers.

Responsive behavior should follow a fluid dashboard model: three-column analytics on large screens, two columns on tablets, and single-column stacking on mobile. The sidebar should collapse into a drawer on small screens, and forms should switch from two-column layouts to vertical stacks.

The final UI should feel like a modern educational analytics platform: structured, calm, data-driven, and optimized for instructors reviewing classroom insights and adjusting teaching strategies.

**Design specification**

{
  "project": "TeachLens Frontend UI System",
  "inspiration_sources": [
    "analytics dashboard layout",
    "two-column onboarding form",
    "profile/administration workspace"
  ],

  "design_principles": {
    "overall_style": "clean SaaS academic dashboard",
    "density": "medium-density information layout",
    "tone": "professional, academic, calm",
    "visual_priority": [
      "content clarity",
      "data visualization",
      "quick instructor workflows",
      "minimal visual noise"
    ],
    "corner_radius": "rounded-lg (soft modern UI)",
    "shadow_style": "soft elevation shadows with low blur and subtle opacity",
    "motion": "minimal; hover and focus transitions only"
  },

  "layout_structure": {
    "app_shell": {
      "type": "dashboard layout",
      "regions": [
        "left_sidebar_navigation",
        "top_toolbar",
        "main_content_area"
      ]
    },

    "left_sidebar_navigation": {
      "width": "240px desktop",
      "background": "primary-dark or neutral-900",
      "elements": [
        "app logo",
        "navigation groups",
        "secondary tools",
        "user profile footer"
      ],
      "navigation_items": [
        "Dashboard",
        "Classes",
        "Assessments",
        "Teaching Strategies",
        "Analytics",
        "Settings",
        "Help"
      ],
      "interaction": {
        "active_item": "primary accent background",
        "hover": "light primary tint"
      }
    },

    "top_toolbar": {
      "height": "64px",
      "content": [
        "global search",
        "notifications",
        "user avatar menu"
      ],
      "alignment": {
        "search": "center-left",
        "actions": "right aligned"
      }
    },

    "main_content_area": {
      "padding": "24px",
      "sections": [
        "dashboard_metrics",
        "data_visualizations",
        "class_activity",
        "teaching_recommendations"
      ]
    }
  },

  "dashboard_components": {
    "metric_cards": {
      "layout": "grid",
      "columns": {
        "desktop": 3,
        "tablet": 2,
        "mobile": 1
      },
      "content": [
        "Average Score",
        "Participation Rate",
        "Confidence Level"
      ],
      "card_structure": {
        "title": "small label",
        "primary_metric": "large numeric value",
        "trend_indicator": "small badge with percent change",
        "icon": "top-right subtle icon"
      }
    },

    "data_visualizations": {
      "types": [
        "bar charts",
        "line charts",
        "stacked distribution charts",
        "donut charts"
      ],
      "containers": {
        "padding": "20px",
        "background": "card background",
        "border": "light border"
      }
    },

    "class_activity_panel": {
      "structure": [
        "recent assessments",
        "latest teaching methods logged",
        "student understanding signals"
      ],
      "list_item_structure": {
        "title": "activity name",
        "timestamp": "relative time",
        "context": "assessment or concept"
      }
    }
  },

  "assessment_forms": {
    "layout_type": "two column form on desktop",
    "left_panel": {
      "purpose": "visual teaching illustration or contextual graphic",
      "background": "primary gradient",
      "content": [
        "illustration",
        "headline",
        "subtext"
      ]
    },

    "right_panel": {
      "purpose": "form input",
      "form_fields": [
        "assessment_title",
        "assessment_date",
        "topic_or_concept",
        "average_score",
        "average_confidence",
        "participation_rate",
        "current_teaching_method",
        "teacher_observation"
      ],
      "interaction_elements": [
        "input fields",
        "select dropdown",
        "textarea",
        "submit button"
      ]
    },

    "input_style": {
      "border": "neutral border",
      "focus": "primary accent ring",
      "radius": "rounded-md"
    }
  },

  "profile_and_settings_views": {
    "structure": {
      "sidebar_navigation": "vertical menu",
      "content_tabs": [
        "Overview",
        "Classes",
        "Performance",
        "Files",
        "Settings"
      ]
    },
    "profile_card": {
      "elements": [
        "avatar",
        "name",
        "contact info",
        "institution info"
      ]
    }
  },

  "color_system": {
    "primary_palette": {
      "base": "#2563EB", 
      "light": "#3B82F6",
      "dark": "#1E40AF"
    },

    "secondary_palette": {
      "base": "#14B8A6",
      "light": "#2DD4BF",
      "dark": "#0F766E"
    },

    "gray_scale": {
      "50": "#F9FAFB",
      "100": "#F3F4F6",
      "200": "#E5E7EB",
      "300": "#D1D5DB",
      "400": "#9CA3AF",
      "500": "#6B7280",
      "600": "#4B5563",
      "700": "#374151",
      "800": "#1F2937",
      "900": "#111827"
    },

    "accent_colors": {
      "success": "#22C55E",
      "warning": "#F59E0B",
      "danger": "#EF4444",
      "info": "#38BDF8"
    }
  },

  "light_mode": {
    "background": "gray-50",
    "cards": "white",
    "text_primary": "gray-900",
    "text_secondary": "gray-600",
    "sidebar": "white with border",
    "charts": "primary and secondary palette"
  },

  "dark_mode": {
    "background": "gray-900",
    "cards": "gray-800",
    "text_primary": "gray-100",
    "text_secondary": "gray-400",
    "sidebar": "gray-950",
    "charts": "slightly desaturated palette"
  },

  "typography": {
    "font_family": "modern sans-serif",
    "scale": {
      "h1": "32px",
      "h2": "24px",
      "h3": "20px",
      "body": "16px",
      "caption": "14px"
    },
    "weights": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },

  "spacing_system": {
    "base_unit": 4,
    "common_values": [
      4,
      8,
      12,
      16,
      20,
      24,
      32,
      40,
      48
    ]
  },

  "responsive_breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  },

  "responsive_behavior": {
    "sidebar": {
      "desktop": "persistent",
      "tablet": "collapsible",
      "mobile": "drawer menu"
    },
    "dashboard_cards": {
      "desktop": "3 columns",
      "tablet": "2 columns",
      "mobile": "1 column"
    },
    "forms": {
      "desktop": "two column layout",
      "mobile": "single column stacked"
    }
  }
}