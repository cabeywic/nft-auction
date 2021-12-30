import * as React from "react";
import { VechaiProvider, Button, extendTheme, colors } from "@vechaiui/react";

// 2.Define new color scheme
const cool = {
  id: "cool",
  type: "dark",
  colors: {
    bg: {
      base: colors.coolGray["900"],
      fill: colors.coolGray["900"],
    },
    text: {
      foreground: colors.coolGray["100"],
      muted: colors.coolGray["300"],
    },
    primary: colors.cyan,
    neutral: colors.coolGray,
  },
}

// or custom default color scheme
const light = {
  id: "light",
  type: "light",
  colors: {
    bg: {
      base: colors.gray["800"],
      fill: colors.gray["900"],
    },
    text: {
      foreground: colors.gray["100"],
      muted: colors.gray["300"],
    },
    primary: colors.teal,
    neutral: colors.gray,
  },
}

const midnight = {
  id: "midnight",
  type: "dark",
  colors: {
    bg: {
      base: colors.trueGray["900"],
      fill: colors.trueGray["900"],
    },
    text: {
      foreground: colors.trueGray["100"],
      muted: colors.trueGray["300"],
    },
    primary: colors.rose,
    neutral: colors.trueGray,
  },
};

const pale = {
  id: "pale",
  type: "dark",
  colors: {
    bg: {
      base: colors.blueGray["800"],
      fill: colors.blueGray["900"],
    },
    text: {
      foreground: colors.blueGray["100"],
      muted: colors.blueGray["300"],
    },
    primary: colors.violet,
    neutral: colors.blueGray,
  },
};

// 3. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  cursor: "pointer",
  colorSchemes: {
    light,
    cool,
    midnight,
    pale
  },
});

export default function Home() {
  return (
    <VechaiProvider theme={theme} colorScheme="midnight">
      <Button variant="solid" color="primary">Hello Vechai</Button>
    </VechaiProvider>
  );
}