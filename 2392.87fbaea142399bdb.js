"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[2392],{2392:(w,a,l)=>{l.r(a),l.d(a,{ion_split_pane:()=>p});var d=l(9204),n=l(614),b=l(4300);const r="split-pane-main",c="split-pane-side",h={xs:"(min-width: 0px)",sm:"(min-width: 576px)",md:"(min-width: 768px)",lg:"(min-width: 992px)",xl:"(min-width: 1200px)",never:""},p=class{constructor(e){(0,n.r)(this,e),this.ionSplitPaneVisible=(0,n.d)(this,"ionSplitPaneVisible",7),this.visible=!1,this.contentId=void 0,this.disabled=!1,this.when=h.lg}visibleChanged(e){this.ionSplitPaneVisible.emit({visible:e})}isVisible(){var e=this;return(0,d.A)(function*(){return Promise.resolve(e.visible)})()}connectedCallback(){var e=this;return(0,d.A)(function*(){typeof customElements<"u"&&null!=customElements&&(yield customElements.whenDefined("ion-split-pane")),e.styleMainElement(),e.updateState()})()}disconnectedCallback(){this.rmL&&(this.rmL(),this.rmL=void 0)}updateState(){if(this.rmL&&(this.rmL(),this.rmL=void 0),this.disabled)return void(this.visible=!1);const e=this.when;if("boolean"==typeof e)return void(this.visible=e);const o=h[e]||e;if(0===o.length)return void(this.visible=!1);const i=s=>{this.visible=s.matches},t=window.matchMedia(o);t.addListener(i),this.rmL=()=>t.removeListener(i),this.visible=t.matches}styleMainElement(){const e=this.contentId,o=this.el.children,i=this.el.childElementCount;let t=!1;for(let s=0;s<i;s++){const f=o[s],m=void 0!==e&&f.id===e;if(m){if(t)return void console.warn("split pane cannot have more than one main node");v(f,m),t=!0}}t||console.warn("split pane does not have a specified main node")}render(){const e=(0,b.b)(this);return(0,n.h)(n.f,{key:"d54c356cd4bff7e55325160882dea8249f47f388",class:{[e]:!0,[`split-pane-${e}`]:!0,"split-pane-visible":this.visible}},(0,n.h)("slot",{key:"af62690d0fd686cfbd29d888c79eda9001f13e2f"}))}get el(){return(0,n.i)(this)}static get watchers(){return{visible:["visibleChanged"],disabled:["updateState"],when:["updateState"]}}},v=(e,o)=>{let i,t;o?(i=r,t=c):(i=c,t=r);const s=e.classList;s.add(i),s.remove(t)};p.style={ios:":host{--side-width:100%;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:nowrap;flex-wrap:nowrap;contain:strict}:host(.split-pane-visible) ::slotted(.split-pane-main){left:0;right:0;top:0;bottom:0;position:relative;-ms-flex:1;flex:1;-webkit-box-shadow:none;box-shadow:none;overflow:hidden;z-index:0}::slotted(.split-pane-side:not(ion-menu)){display:none}:host{--border:0.55px solid var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, var(--ion-background-color-step-250, #c8c7cc))));--side-min-width:270px;--side-max-width:28%}",md:":host{--side-width:100%;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:nowrap;flex-wrap:nowrap;contain:strict}:host(.split-pane-visible) ::slotted(.split-pane-main){left:0;right:0;top:0;bottom:0;position:relative;-ms-flex:1;flex:1;-webkit-box-shadow:none;box-shadow:none;overflow:hidden;z-index:0}::slotted(.split-pane-side:not(ion-menu)){display:none}:host{--border:1px solid var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-150, var(--ion-background-color-step-150, rgba(0, 0, 0, 0.13)))));--side-min-width:270px;--side-max-width:28%}"}}}]);
//# sourceMappingURL=2392.87fbaea142399bdb.js.map