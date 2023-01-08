const path = require('path');


module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  // Other configuration options
  // module: {
  //   rules: [
  //     {
  //       test: /\.json$/,
  //       use: ['json-loader'],
  //     },
  //   ],
  // },

  // devServer: {
  //   index: "demo.html",
  //   contentBase: path.resolve(__dirname),
  //   port: 3000,
  //   hot: true,
  // },
};

//
// const path = require('path');
// module.exports = {
//   entry: './src/index.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'gpt-3-encoder.bundle.js',
//   },
//   mode: 'production',
//   module: {
//     rules: [
//       {
//         test: /\.m?js$/,
//         exclude: /(node_modules|bower_components)/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//     ]
//   }
// };
