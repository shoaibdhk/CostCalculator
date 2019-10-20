import PleaseSignIn from '../components/auth/PleaseSignIn';
import Dashboard from '../components/layout/Dashboard';
// class Home extends Component {
//     static async getInitialProps({ res, apolloClient }) {
//       const { data } = await apolloClient.query({ query: CURRENT_USER_QUERY })

//       console.log(res)
//       if (data.me === null) {
//         if (res !== undefined) {
//           res.redirect('/signon')
//         } else {
//           Router.push('/signon')
//         }
//       }

//       return {}
//     }
//   render() {
//     return (

//     )
//   }
// }

const Home = props => (
  <PleaseSignIn>
    <Dashboard />;
  </PleaseSignIn>
);

export default Home;
