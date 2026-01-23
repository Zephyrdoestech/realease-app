module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // 🔴 THIS MUST BE AT THE VERY BOTTOM OF THE PLUGINS ARRAY
      "react-native-reanimated/plugin", 
    ],
  };
};