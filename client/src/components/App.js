import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import MemberLoginPage from "./views/LoginPage/MemberLoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import RegisterList from "./views/RegisterPage/RegisterList";
import MemberUpload from "./views/MemberPage/MemberUpload";
import MemberList from "./views/MemberPage/MemberList";
import MemberRank from "./views/MemberPage/MemberRank";
import AllSubSlot from "./views/SubSlot/AllSubSlot";
import SubSlot from "./views/SubSlot/SubSlot";
import SlotUsing from "./views/SubSlot/SlotUsing";
import SlotModify from "./views/SubSlot/SlotModify";
import SlotExtend from "./views/SubSlot/SlotExtend";
import TestSlot from "./views/SlotPage/TestSlot";
import TestSlotUpload from "./views/SlotPage/TestSlotUpload";
import SlotExpire from "./views/SubSlot/SlotExpire";
import AllSlot from "./views/SubSlot/AllSlot";
import SlotPage from "./views/SlotPage/SlotPage";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(MemberLoginPage)} />
          <Route exact path="/memberlogin" component={Auth(MemberLoginPage)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, true, true)} />
            <Route exact path="/register/list" component={Auth(RegisterList, true, true)} />
          <Route exact path="/member/upload" component={Auth(MemberUpload, true)} />
          <Route exact path="/member/list" component={Auth(MemberList, true)} />
          <Route exact path="/member/rank" component={Auth(MemberRank)} />
            <Route exact path="/subslot" component={Auth(SubSlot, true)} />
            <Route exact path="/subslot/using" component={Auth(SlotUsing, true)} />
            <Route exact path="/subslot/extend" component={Auth(SlotExtend, true)} />
          <Route exact path="/testslot" component={Auth(TestSlot, true)} />
          <Route exact path="/testslotupload" component={Auth(TestSlotUpload, true)} />
            <Route exact path="/subslot/modify/:slotId" component={Auth(SlotModify)} />
            <Route exact path="/allsubslot" component={Auth(AllSubSlot, true, true)} />
          <Route exact path="/allslot" component={Auth(AllSlot, true, true)} />
          <Route exact path="/slotexpire" component={Auth(SlotExpire, true, true)} />
          <Route exact path="/slot" component={Auth(SlotPage)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
