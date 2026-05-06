export const theme = {
  colors: {
    bg: "#FFFDF3",
    bgWarm: "#FAF7ED",
    card: "#FFFFFF",
    border: "#F1E8D8",
    borderStrong: "#EEE7D6",
    text: "#5A342A",
    textMuted: "#7C7568",
    textSubtle: "#A59D91",
    brand: "#B76B43",
    brandDeep: "#A45E43",
    accent: "#F4B79E",
    accentSoft: "#FFD7BF",
    disabled: "#D3C4BE",
  },
  radius: {
    sm: 14,
    md: 20,
    lg: 24,
    xl: 32,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  typography: {
    title: 28,
    header: 17,
    body: 14,
    small: 12,
  },
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
  },
} as const;

export type Theme = typeof theme;
