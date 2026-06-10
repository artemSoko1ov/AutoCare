import postcssPresetEnv from "postcss-preset-env";
import postcssPxToRem from "postcss-pxtorem";

export default {
  plugins: [
    postcssPresetEnv({
      stage: 3,
    }),
    postcssPxToRem({
      rootValue: 16,
      propList: ["*"],
      unitPrecision: 5,
      minPixelValue: 1,
      mediaQuery: false,
      replace: true,
    }),
  ],
};
