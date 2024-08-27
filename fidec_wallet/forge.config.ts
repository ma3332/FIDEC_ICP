import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerSquirrel } from "@electron-forge/maker-squirrel";
import { MakerZIP } from "@electron-forge/maker-zip";
import { MakerDeb } from "@electron-forge/maker-deb";
import { MakerRpm } from "@electron-forge/maker-rpm";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ["darwin"]),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      devContentSecurityPolicy:
        "connect-src 'self' https://fonts.googleapis.com/css2 wss://relay.walletconnect.com https://goerli.infura.io/v3/ wss://goerli.infura.io/ws/v3/ https://mainnet.infura.io/v3/ https://polygon-mainnet.g.alchemy.com/v2/ https://data-seed-prebsc-1-s1.binance.org:8545 https://bsc-dataseed.bnbchain.org wss://mainnet.infura.io/ws/v3/ ws://localhost:8080/ https://verify.walletconnect.org/at https://api.covalenthq.com/ 'unsafe-eval'",
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./public/index.html",
            js: "./src/index.tsx",
            name: "main_window",
            preload: {
              js: "./process/electron/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
