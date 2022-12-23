import Layout from '../components/layout'
import { ToastContainer } from "react-toastify"
import { Provider } from "react-redux"
import store from '../redux/store'
import {ThemeProvider} from 'next-themes'

import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'



function MyApp({ Component, pageProps }) {
  return (
      <Provider store={store}>
        <ThemeProvider attribute="class">
          <Layout Layout>
            <ToastContainer />
              <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
      </Provider>
   )
}

export default MyApp
