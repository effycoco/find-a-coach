(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3d398bd4"],{"212c":function(t,e,i){"use strict";i.r(e);var o=i("7a23");const s=t=>(Object(o["y"])("data-v-32903374"),t=t(),Object(o["w"])(),t),a={class:"form-control"},n=s(()=>Object(o["i"])("label",{for:"email"},"Email",-1)),r={class:"form-control"},c=s(()=>Object(o["i"])("label",{for:"password"},"Password",-1)),d={key:0};function l(t,e,i,s,l,b){const u=Object(o["D"])("base-dialog"),m=Object(o["D"])("base-spinner"),h=Object(o["D"])("base-button"),j=Object(o["D"])("base-card");return Object(o["v"])(),Object(o["h"])("div",null,[Object(o["k"])(u,{show:!!l.error,title:"An error occured!",onClose:b.handleError},{default:Object(o["L"])(()=>[Object(o["i"])("p",null,Object(o["G"])(l.error),1)]),_:1},8,["show","onClose"]),Object(o["k"])(u,{show:l.isLoading,title:"Authenticating...",fixed:""},{default:Object(o["L"])(()=>[Object(o["k"])(m)]),_:1},8,["show"]),Object(o["k"])(j,null,{default:Object(o["L"])(()=>[Object(o["i"])("form",{onSubmit:e[2]||(e[2]=Object(o["N"])((...t)=>b.submitForm&&b.submitForm(...t),["prevent"]))},[Object(o["i"])("div",a,[n,Object(o["M"])(Object(o["i"])("input",{type:"email",id:"email",name:"email","onUpdate:modelValue":e[0]||(e[0]=t=>l.email=t)},null,512),[[o["J"],l.email,void 0,{trim:!0}]])]),Object(o["i"])("div",r,[c,Object(o["M"])(Object(o["i"])("input",{type:"password",id:"password",name:"password","onUpdate:modelValue":e[1]||(e[1]=t=>l.password=t)},null,512),[[o["J"],l.password,void 0,{trim:!0}]])]),l.formIsValid?Object(o["g"])("",!0):(Object(o["v"])(),Object(o["h"])("p",d," Please enter a valid email and password(must be at least 6 characters long). ")),Object(o["k"])(h,null,{default:Object(o["L"])(()=>[Object(o["j"])(Object(o["G"])(b.submitButtonCaption),1)]),_:1}),Object(o["k"])(h,{type:"button",mode:"flat",onClick:b.switchMode},{default:Object(o["L"])(()=>[Object(o["j"])(Object(o["G"])(b.switchModeButtonCaption),1)]),_:1},8,["onClick"])],32)]),_:1})])}i("caad");var b={data(){return{email:"",password:"",formIsValid:!0,mode:"login",isLoading:!1,error:null}},computed:{submitButtonCaption(){return"login"===this.mode?"Login":"Signup"},switchModeButtonCaption(){return"login"===this.mode?"Signup instead":"Login instead"}},methods:{handleError(){this.error=null},async submitForm(){if(this.formIsValid=!0,""===this.email||!this.email.includes("@")||this.password.length<6)this.formIsValid=!1;else{this.isLoading=!0;try{await this.$store.dispatch("auth",{email:this.email,password:this.password,mode:this.mode});const t="/"+(this.$route.query.redirect||"coaches");this.$router.replace(t)}catch(t){this.error=t.message||"Failed to authenticate, try later"}this.isLoading=!1}},switchMode(){"login"===this.mode?this.mode="signup":this.mode="login"}}},u=(i("e2a8"),i("6b0d")),m=i.n(u);const h=m()(b,[["render",l],["__scopeId","data-v-32903374"]]);e["default"]=h},2573:function(t,e,i){},e2a8:function(t,e,i){"use strict";i("2573")}}]);
//# sourceMappingURL=chunk-3d398bd4.920d9d9f.js.map