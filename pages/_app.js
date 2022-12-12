import '../styles/globals.css'
import Layout from '../components/layout'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { Provider } from "react-redux"
import store from '../redux/store'
import {ThemeProvider} from 'next-themes'



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
