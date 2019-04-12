import Cookies from "js-cookie";
import React, { Fragment } from "react";
import {
  Stitch,
  RemoteMongoClient,
  StitchServiceError,
  AnonymousCredential
} from "mongodb-stitch-browser-sdk";
import { Helmet } from "react-helmet";
import {
  Button,
  Badge,
  Container,
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  Row,
  Col
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import {
  HashRouter as Router,
  Link,
  NavLink,
  Route,
  Switch
} from "react-router-dom";
import { provideState, injectState } from "reaclette";
import { isEmpty } from "lodash";

import AccountMenu from "./account-menu";
import Admin from "./admin";
import AppIcon from "./imgs/app-icon-brand.png";
import AuthOrCreate from "./auth-or-create";
import ConfirmPage from "./confirm-page";
import ConfirmReset from "./confirm-reset";
import ContactUs from "./contact-us";
import ContestExam from "./contest-exam";
import Contribuate from "./contribuate";
import Exam from "./pass-exam/exam";
import ExamMenuNav from "./exam-menu-nav";
import ExamSession from "./my-review/exam-session";
import Footer from "./footer";
import HomePage from "./home";
import LoadingIcon from "./imgs/button-spinner.gif";
import MyReview from "./my-review";
import PassExam from "./pass-exam";
import StatExams from "./stat-exams";
import WhoRUs from "./who-r-us";
import MobileAppModal from "./mobile-app-modal";
import MobileApp from "./mobile-app";

import "./style/hover.css";

let webAppInstaller;

const withState = provideState({
  initialState: () => ({
    authId: undefined,
    authEmail: undefined,
    university: undefined,
    mongodb: undefined,
    serverInstance: undefined,
    userNotConfirmed: undefined,
    postedExams: undefined,
    adminLogged: false,
    lastPostedExams: undefined,
    noNeedToAuthenticate: false,
    authLoading: true,
    navbarCollapse: true,
    proposeMobileApp: false
  }),
  effects: {
    initialize: effects => async state => {
      state.authLoading = true;
      const server = Stitch.initializeDefaultAppClient("med-dz-qcm-idjwm");
      state.serverInstance = server;
      state.mongodb = server
        .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
        .db("med-dz-qcm")
        .collection("qcm");
      if (server.auth.user) {
        // logged
        if (server.auth.user.loggedInProviderName !== "anon-user") {
          effects.signIn(server.auth.user.id);
        }
      } else {
        // user not logged
        try {
          await server.auth.loginWithCredential(new AnonymousCredential());
        } catch (error) {
          effects.handleError(error);
        }
      }
      await effects.handleAppQueryString();
      state.authLoading = false;
      await effects.getLastPostedExams();
      // await state.mongodb.deleteMany({ creator: state.authId })
      // console.log(await state.mongodb.find({}).asArray())
      const navLinks = window.document.querySelectorAll(".navbar-nav>li>a");
      navLinks.forEach(link => {
        if (!link.className.includes("dropdown-toggle nav-link")) {
          link.addEventListener("click", () => {
            effects.toggleNavbar();
          });
        }
      });

      window.addEventListener("beforeinstallprompt", e => {
        state.proposeMobileApp = true;
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // // Stash the event so it can be triggered later.
        webAppInstaller = e;
      });

      window.addEventListener("appinstalled", evt => {
        state.proposeMobileApp = false;
        effects.notifySuccess(
          "Application est installé avec succés, vous allez la trouver sur votre écran d'accueil dans quelques secondes"
        );
      });
    },
    installMobileApp: effects => {
      webAppInstaller.prompt();
      // Wait for the user to respond to the prompt
      webAppInstaller.userChoice.then(choiceResult => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        webAppInstaller = null;
      });
    },
    stopProposingMobileApp: () => state => ({
      ...state,
      proposeMobileApp: false
    }),
    setAuthEmail: (_, authEmail) => state => ({
      ...state,
      authEmail
    }),
    setAdminLogged: effects => state => {
      state.adminLogged = true;
    },
    logOut: () => state => {
      state.serverInstance.auth.logout();
      state.authId = undefined;
    },
    getPostedExams: effects => async state => {
      try {
        const exams = await state.mongodb
          .find(
            { creator: state.authId, type: "exam" },
            {
              projection: {
                _id: 1,
                examDate: 1,
                date: 1,
                approved: 1,
                completed: 1,
                university: 1,
                module: 1,
                seen: 1
              }
            }
          )
          .asArray();
        state.postedExams = exams;
      } catch (error) {
        effects.handleError(error);
      }
    },
    getLastPostedExams: effects => async state => {
      try {
        const exams = await state.mongodb
          .find(
            { approved: true },
            {
              limit: 15,
              sort: { date: -1 },
              projection: {
                _id: 1,
                examDate: 1,
                university: 1,
                module: 1,
                seen: 1
              }
            }
          )
          .asArray();
        state.lastPostedExams = exams;
      } catch (error) {
        effects.handleError(error);
      }
    },
    handleAppQueryString: () => state => {
      const url = window.location.search;
      const params = new URLSearchParams(url);
      const token = params.get("token");
      const tokenId = params.get("tokenId");
      const method = params.get("method");

      if (token && tokenId) {
        state.noNeedToAuthenticate = true;
        if (method === "confirm") {
          const route = `${window.location.origin}${
            window.location.pathname
          }#/confirm?token=${token}&tokenId=${tokenId}`;
          window.location.replace(route);
        }

        if (method === "reset") {
          const route = `${window.location.origin}${
            window.location.pathname
          }#/reset?token=${token}&tokenId=${tokenId}`;
          window.location.replace(route);
        }
      }
    },
    notifyError: (_, errorMessage) => state => {
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    },
    notifySuccess: (_, errorMessage) => state => {
      toast.success(errorMessage, {
        position: "top-right",
        autoClose: 15000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    },
    handleError: async (effects, error) => {
      console.log(error);
      if (error instanceof StitchServiceError) {
        await effects.notifyError(error.message);
      } else {
        await effects.notifyError(
          "Oops, something went wrong! Don't worry, our team is already on it"
        );
      }
    },
    getUserAccount: (effects, authId) => async state => {
      const university = Cookies.get("university") || "Alger";
      state.university = university;
      let user;
      try {
        user = await state.mongodb
          .find({ type: "user", authId, university })
          .asArray();
      } catch (error) {
        effects.handleError(error);
      }
      if (isEmpty(user)) {
        try {
          await state.mongodb.insertOne({ type: "user", authId, university });
        } catch (error) {
          effects.handleError(error);
        }
      }
    },
    signIn: (effects, authId) => async state => {
      await effects.getUserAccount(authId);
      Cookies.set("authId", authId);
      state.authId = authId;
      effects.getPostedExams();
    },
    toggleNavbar: () => state => ({
      ...state,
      navbarCollapse: !state.navbarCollapse
    })
  },
  computed: {
    logged: ({ authId }) => Boolean(authId)
  }
});

const App = ({ effects, state }) => (
  <div className="App">
    <Helmet>
      <title>Hakima QCM</title>
    </Helmet>
    <ToastContainer
      position="top-center"
      autoClose={20000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnVisibilityChange
      draggable
      pauseOnHover
    />
    {state.authLoading ? (
      <Row className="my-3">
        <Col md={{ size: 2, offset: 5 }}>
          <br />
          <div className="text-center">
            <img src={LoadingIcon} width="50" height="50" alt="Loading..." />
          </div>
          <p className="text-muted text-center">
            Application en chargement ...
          </p>
        </Col>
      </Row>
    ) : (
      state.mongodb &&
      state.serverInstance && (
        <Router>
          <Row
          // style={{ marginRight: '-15px', marginLeft: '-15px' }}
          >
            <Col xs="12" md="12">
              <Navbar
                light
                expand="lg"
                style={{
                  backgroundColor: "#222534",
                  fontSize: "16px",
                  boxShadow: "0 3px 5px rgba(0,0,0,.1)"
                }}
              >
                <NavbarBrand
                  href="#"
                  style={{ margin: 0 }}
                  className="hvr-icon-spin"
                >
                  <img
                    src={AppIcon}
                    alt="icon"
                    height="50"
                    width="60"
                    className="hvr-icon"
                  />{" "}
                  <span
                    style={{
                      color: "white",
                      fontSize: "22px",
                      verticalAlign: "middle"
                    }}
                  >
                    Haki<strong style={{ color: "#7bc3d1" }}>ma</strong> QCM
                  </span>
                </NavbarBrand>
                <NavbarToggler
                  onClick={effects.toggleNavbar}
                  className="mr-2"
                  style={{ backgroundColor: "#e2e3e4" }}
                />
                <Collapse isOpen={!state.navbarCollapse} navbar>
                  <Nav className="ml-auto" navbar style={{ fontSize: "18px" }}>
                    <NavItem active={false} className="hvr-underline-reveal">
                      <NavLink
                        className="nav-link"
                        to="/accueil"
                        style={{
                          color: "#e2e3e4"
                        }}
                        activeStyle={{ color: "#7bc3d1" }}
                      >
                        Accueil
                      </NavLink>
                    </NavItem>
                    <NavItem className="hvr-underline-reveal">
                      <NavLink
                        className="nav-link"
                        to={
                          state.logged
                            ? "/contribuer"
                            : "/authenticate?toggle=authentication"
                        }
                        style={{
                          color: "#e2e3e4"
                        }}
                        activeStyle={{ color: "#7bc3d1" }}
                      >
                        Contribuer
                      </NavLink>
                    </NavItem>
                    <ExamMenuNav />
                    <NavItem className="hvr-underline-reveal">
                      <NavLink
                        className="nav-link"
                        to="/concours"
                        style={{
                          color: "#e2e3e4"
                        }}
                        activeStyle={{ color: "#7bc3d1" }}
                      >
                        Passer un concours
                      </NavLink>
                    </NavItem>
                    <NavItem className="hvr-underline-reveal">
                      <NavLink
                        className="nav-link"
                        to="/stats"
                        style={{
                          color: "#e2e3e4"
                        }}
                        activeStyle={{ color: "#7bc3d1" }}
                      >
                        Statistiques
                      </NavLink>
                    </NavItem>
                    <NavItem className="hvr-underline-reveal">
                      <NavLink
                        className="nav-link"
                        to="/mobileapp"
                        style={{
                          color: "#e2e3e4"
                        }}
                        activeStyle={{ color: "#7bc3d1" }}
                      >
                        Application mobile
                      </NavLink>
                    </NavItem>
                    <NavItem className="hvr-underline-reveal">
                      <NavLink
                        className="nav-link"
                        to="/quisommesnous"
                        style={{
                          color: "#e2e3e4"
                        }}
                        activeStyle={{ color: "#7bc3d1" }}
                      >
                        Qui sommes nous ?
                      </NavLink>
                    </NavItem>
                    <NavItem className="hvr-underline-reveal">
                      <NavLink
                        className="nav-link"
                        to="/contacteznous"
                        style={{
                          color: "#e2e3e4"
                        }}
                        activeStyle={{ color: "#7bc3d1" }}
                      >
                        Contacter nous
                      </NavLink>
                    </NavItem>
                    &nbsp;
                    {!state.logged && (
                      <Fragment>
                        <Link
                          className="btn btn-light"
                          to={`/authenticate?toggle=createAccount`}
                          onClick={effects.toggleNavbar}
                        >
                          S'inscrire
                        </Link>
                        &nbsp;
                        <Link
                          className="btn btn-info"
                          to={`/authenticate?toggle=authentication`}
                          onClick={effects.toggleNavbar}
                        >
                          Se connecter
                        </Link>
                      </Fragment>
                    )}
                    {state.logged && <AccountMenu />}
                  </Nav>
                </Collapse>
              </Navbar>
              <Container fluid style={{ marginTop: "20px" }}>
                <Row>
                  <Col md={{ size: 10, offset: 1 }} xs="12">
                    <Switch>
                      <Route exact path="/accueil" component={HomePage} />
                      <Route exact path="/" component={HomePage} />
                      <Route path="/admin" component={Admin} />
                      <Route path="/confirm" component={ConfirmPage} />
                      <Route path="/contacteznous" component={ContactUs} />
                      <Route path="/concours" component={ContestExam} />
                      <Route path="/reset" component={ConfirmReset} />
                      <Route path="/authenticate" component={AuthOrCreate} />
                      <Route exact path="/examen" component={PassExam} />
                      <Route path="/examen/:examId" component={Exam} />
                      <Route path="/quisommesnous" component={WhoRUs} />
                      <Route exact path="/marevision" component={MyReview} />
                      <Route exact path="/stats" component={StatExams} />
                      <Route exact path="/mobileapp" component={MobileApp} />
                      <Route
                        exact
                        path="/marevision/:reviewId"
                        component={ExamSession}
                      />
                      {state.logged && (
                        <Fragment>
                          <Route
                            exact
                            path="/contribuer"
                            component={Contribuate}
                          />
                          <Route
                            path="/contribuer/:examId"
                            component={Contribuate}
                          />
                        </Fragment>
                      )}
                      <Route exact component={HomePage} />
                    </Switch>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Router>
      )
    )}
    <MobileAppModal
      onAction={effects.installMobileApp}
      onClose={effects.stopProposingMobileApp}
      mobileAppModalOpen={state.proposeMobileApp}
    />
    <Footer />
  </div>
);

export default withState(injectState(App));
