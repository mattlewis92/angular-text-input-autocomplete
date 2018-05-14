import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { getIfUtils, removeEmpty } from 'webpack-config-utils';
// import { AngularCompilerPlugin } from '@ngtools/webpack';
import OfflinePlugin from 'offline-plugin';

export default (environment = 'development') => {
  const { ifProduction, ifDevelopment } = getIfUtils(environment);

  return {
    mode: environment,
    devtool: ifProduction('source-map', 'eval'),
    entry: path.join(__dirname, 'demo', 'entry.ts'),
    output: {
      filename: ifProduction('[name]-[chunkhash].js', '[name].js')
    },
    module: {
      rules: removeEmpty([
        ifDevelopment({
          test: /\.ts$/,
          loader: 'tslint-loader',
          exclude: /node_modules/,
          enforce: 'pre'
        }),
        ifDevelopment(
          {
            test: /\.ts$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
              transpileOnly: true
            }
          },
          {
            test: /\.ts$/,
            loader: '@ngtools/webpack'
          }
        ),
        {
          test: /node_modules\/@angular\/core\/.+\/core\.es5\.js$/,
          parser: {
            system: true // disable `System.import() is deprecated and will be removed soon. Use import() instead.` warning
          }
        }
      ])
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    devServer: {
      port: 8000,
      inline: true,
      hot: true,
      historyApiFallback: true,
      overlay: true
    },
    plugins: removeEmpty([
      /*ifProduction(
        new AngularCompilerPlugin({
          tsConfigPath: './tsconfig-demo.json'
        })
      ),*/
      ifDevelopment(new webpack.HotModuleReplacementPlugin()),
      ifDevelopment(
        new ForkTsCheckerWebpackPlugin({
          watch: ['./src', './demo'],
          formatter: 'codeframe'
        })
      ),
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular/,
        path.join(__dirname, 'src')
      ),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'demo', 'index.ejs')
      }),
      ifProduction(new OfflinePlugin())
    ])
  };
};
