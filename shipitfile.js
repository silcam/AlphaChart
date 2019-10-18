module.exports = shipit => {
  // Load shipit-deploy tasks
  require("shipit-deploy")(shipit);
  require("shipit-shared")(shipit);

  shipit.initConfig({
    default: {
      deployTo: "/var/www/alphachart",
      repositoryUrl: "https://github.com/silcam/AlphaChart.git",
      shared: {
        overwrite: true,
        basePath: "/var/www/alphachart/shared",
        dirs: ["node_modules", "client/public"],
        files: ["secrets.json"]
      }
    },
    production: {
      servers: { host: "george", user: "alphachart" }
    }
  });

  shipit.blTask("build", async () => {
    try {
      res = await shipit.remote(
        `cd ${shipit.releasePath} && yarn install --production && yarn tsc && yarn build`
      );
      // console.log(res.stdout);
    } catch (err) {
      console.error(err.stderr);
    }
  });

  // shipit.blTask("versionAssets", async () => {
  //   try {
  //     await shipit.remote(
  //       `cd ${shipit.releasePath} && node tasks/versionAssets.js`
  //     );
  //   } catch (err) {
  //     console.error(err.stderr);
  //   }
  // });

  shipit.blTask("restart", async () => {
    try {
      res = await shipit.remote(
        "passenger-config restart-app /var/www/alphachart"
      );
    } catch (err) {
      console.error(err.stderr);
    }
  });

  shipit.on("sharedEnd", () => {
    shipit.start("build", "restart");
  });
};
