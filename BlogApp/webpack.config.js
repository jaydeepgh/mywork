/*
module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
*/

var config = {
   entry: './src/index.js',

  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
/*
   output: {
      path:'/',
      filename: 'bundle.js',
   },
*/	
   devServer: {
      historyApiFallback: true,
      inline: true,
      port: 8080,
    contentBase: './' 
  },
	
   module: {
      loaders: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader', 

            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
   }
}

module.exports = config;
