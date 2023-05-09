const {
  AndroidConfig,
  withAndroidColors,
  withAndroidColorsNight,
  withAndroidManifest,
  withDangerousMod,
  withPlugins,
} = require("expo/config-plugins");
const { Colors } = require("@expo/config-plugins/build/android");
const fs = require("fs");
const path = require("path");

function hexToRgbPct(hex) {
  // round to 3 decimal places for Xcode assets format
  const r = (parseInt(hex.slice(1, 3), 16) / 255).toFixed(3);
  const g = (parseInt(hex.slice(3, 5), 16) / 255).toFixed(3);
  const b = (parseInt(hex.slice(5, 7), 16) / 255).toFixed(3);

  return { r, g, b };
}

function createIosColorContent(light, dark) {
  const lightRgb = hexToRgbPct(light);
  const darkRgb = hexToRgbPct(dark);

  return `{
  "colors": [
    {
      "color": {
        "color-space": "srgb",
        "components": {
          "alpha": "1.000",
          "blue": "${lightRgb.b}",
          "green": "${lightRgb.g}",
          "red": "${lightRgb.r}"
        }
      },
      "idiom": "universal"
    },
    {
      "appearances": [
        {
          "appearance": "luminosity",
          "value": "dark"
        }
      ],
      "color": {
        "color-space": "srgb",
        "components": {
          "alpha": "1.000",
          "blue": "${darkRgb.b}",
          "green": "${darkRgb.g}",
          "red": "${darkRgb.r}"
        }
      },
      "idiom": "universal"
    }
  ],
  "info": {
    "author": "xcode",
    "generator": "platform-colors",
    "version": 1
  }
}
  `;
}

const withPlatformColorsIos = (config) => {
  return withDangerousMod(config, [
    "ios",
    async (config) => {
      Object.entries(config.platformColors).forEach(([token, colorValues]) => {
        const content = createIosColorContent(
          colorValues.light,
          colorValues.dark
        );
        const iosColorName = token[0].toUpperCase() + token.slice(1);
        const contentpath = `ios/${config.modRequest.projectName}/Images.xcassets/${iosColorName}.colorset/`;
        fs.mkdirSync(contentpath, { recursive: true });
        fs.writeFileSync(path.join(contentpath, "Contents.json"), content);
      });
      return config;
    },
  ]);
};

const withPlatformColorsAndroid = (config) => {
  Object.entries(config.platformColors).forEach(([token, colorValues]) => {
    config = withAndroidColors(config, (config) => {
      config.modResults = Colors.assignColorValue(config.modResults, {
        value: colorValues.light,
        name: token,
      });
      return config;
    });
    config = withAndroidColorsNight(config, (config) => {
      config.modResults = Colors.assignColorValue(config.modResults, {
        value: colorValues.dark,
        name: token,
      });
      return config;
    });
  });

  // Remove uiMode from MainActivity configChanges so that
  // the activity automatically restarts when system theme is changed
  config = withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    const application =
      AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
    const mainActivity = application["activity"].find(
      (item) => item.$["android:name"] === ".MainActivity"
    );

    mainActivity.$ = {
      ...mainActivity.$,
      "android:configChanges": mainActivity.$["android:configChanges"].replace(
        "|uiMode",
        ""
      ),
    };

    config.modResults = manifest;
    return config;
  });

  return config;
};

const withPlatformColors = (config) => {
  return withPlugins(config, [
    withPlatformColorsIos,
    withPlatformColorsAndroid,
  ]);
};

module.exports = withPlatformColors;
