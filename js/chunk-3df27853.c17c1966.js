(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3df27853"],{4273:function(e,t,a){"use strict";a("c458")},a980:function(e,t,a){"use strict";a.r(t);var s=a("7a23");const i=e=>(Object(s["y"])("data-v-5ac320ea"),e=e(),Object(s["w"])(),e),c={class:"form-control"},o=i(()=>Object(s["i"])("label",{for:"email"},"Your Email",-1)),m={class:"form-control"},r=i(()=>Object(s["i"])("label",{for:"message"},"Your Message",-1)),l={key:0},n={class:"actions"},d=Object(s["j"])("Send Message");function b(e,t,a,i,b,u){const j=Object(s["D"])("base-button");return Object(s["v"])(),Object(s["h"])("form",{onSubmit:t[2]||(t[2]=Object(s["N"])((...e)=>u.submitForm&&u.submitForm(...e),["prevent"]))},[Object(s["i"])("div",c,[o,Object(s["M"])(Object(s["i"])("input",{type:"email",id:"email","onUpdate:modelValue":t[0]||(t[0]=e=>b.email=e)},null,512),[[s["J"],b.email,void 0,{trim:!0}]])]),Object(s["i"])("div",m,[r,Object(s["M"])(Object(s["i"])("textarea",{id:"message",rows:"5","onUpdate:modelValue":t[1]||(t[1]=e=>b.message=e)},null,512),[[s["J"],b.message,void 0,{trim:!0}]])]),b.formIsValid?Object(s["g"])("",!0):(Object(s["v"])(),Object(s["h"])("p",l,"Please enter a valid email and non-empty message.")),Object(s["i"])("div",n,[Object(s["k"])(j,null,{default:Object(s["L"])(()=>[d]),_:1})])],32)}a("caad");var u={data(){return{email:"",message:"",formIsValid:!0}},methods:{submitForm(){if(this.formIsValid=!0,""===this.email||!this.email.includes("@")||""===this.message)return void(this.formIsValid=!1);const e={email:this.email,message:this.message,coachId:this.$route.params.id};this.$store.dispatch("requests/addRequest",e),this.$router.replace("/coaches")}}},j=(a("4273"),a("6b0d")),O=a.n(j);const h=O()(u,[["render",b],["__scopeId","data-v-5ac320ea"]]);t["default"]=h},c458:function(e,t,a){}}]);
//# sourceMappingURL=chunk-3df27853.c17c1966.js.map