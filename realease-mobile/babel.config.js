module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // This is the CRITICAL LINE that fixes 'makeMutable' errors
      "react-native-reanimated/plugin", 
    ],
  };
};