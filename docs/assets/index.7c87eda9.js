import{R as A,b as x}from"./regl.efea0522.js";import{r as E}from"./resl-fs.8073eef2.js";var P=542327876,U=131072,R=4,O=l("DXT1"),T=l("DXT3"),S=l("DXT5"),b=l("DX10"),X=116,k=512,I=3,N=2,L=31,z=0,G=1,B=2,W=3,$=4,j=7,q=20,J=21,K=28,Q=V;function V(r){var a=new Int32Array(r,0,L);if(a[z]!==P)throw new Error("Invalid magic number in DDS header");if(!a[q]&R)throw new Error("Unsupported format, must contain a FourCC code");var i,e,p=a[J];switch(p){case O:i=8,e="dxt1";break;case T:i=16,e="dxt3";break;case S:i=16,e="dxt5";break;case X:e="rgba32f";break;case b:var n=new Uint32Array(r.slice(128,128+20));e=n[0];var w=n[1];if(n[2],n[3],n[4],w===I&&e===N)e="rgba32f";else throw new Error("Unsupported DX10 texture format "+e);break;default:throw new Error("Unsupported FourCC code: "+Y(p))}var _=a[B],m=1;_&U&&(m=Math.max(1,a[j]));var g=!1,y=a[K];y&k&&(g=!0);var t=a[$],o=a[W],c=a[G]+4,d=t,D=o,u=[],s;if(p===b&&(c+=20),g)for(var C=0;C<6;C++){if(e!=="rgba32f")throw new Error("Only RGBA32f cubemaps are supported");var F=4*32/8;t=d,o=D;for(var M=Math.log(t)/Math.log(2)+1,f=0;f<M;f++)s=t*o*F,u.push({offset:c,length:s,shape:[t,o]}),f<m&&(c+=s),t=Math.floor(t/2),o=Math.floor(o/2)}else for(var f=0;f<m;f++)s=Math.max(4,t)/4*Math.max(4,o)/4*i,u.push({offset:c,length:s,shape:[t,o]}),c+=s,t=Math.floor(t/2),o=Math.floor(o/2);return{shape:[d,D],images:u,format:e,flags:_,cubemap:g}}function l(r){return r.charCodeAt(0)+(r.charCodeAt(1)<<8)+(r.charCodeAt(2)<<16)+(r.charCodeAt(3)<<24)}function Y(r){return String.fromCharCode(r&255,r>>8&255,r>>16&255,r>>24&255)}var Z="/example-regl/assets/alpine_cliff_a.dca23b6b.dds",H="/example-regl/assets/alpine_cliff_a_norm.1bb9f423.png",rr="/example-regl/assets/alpine_cliff_a_spec.7a99f481.png";const v=A({container:document.body,extensions:"WEBGL_compressed_texture_s3tc"}),h=await E({diffuse:{type:"binary",src:Z,parser(r){const a=Q(r),i=a.images[0],e=a.format;return v.texture({format:`rgba s3tc ${e}`,shape:a.shape,mag:"linear",data:new Uint8Array(r,i.offset,i.length)})}},specular:{type:"image",src:rr,parser(r){return v.texture({mag:"linear",data:r})}},normals:{type:"image",src:H,parser(r){return v.texture({mag:"linear",data:r})}}}),ar=v({frag:x`
    precision mediump float;
    uniform sampler2D specular, normals, diffuse;
    varying vec3 lightDir, eyeDir;
    varying vec2 uv;
    void main () {
      float d = length(lightDir);
      vec3 L = normalize(lightDir);
      vec3 E = normalize(eyeDir);
      vec3 N = normalize(2.0 * texture2D(normals, uv).rgb - 1.0);
      N = vec3(-N.x, N.yz);
      vec3 D = texture2D(diffuse, uv).rgb;
      vec3 kD = D * (0.01 +
        max(0.0, dot(L, N) * (0.6 + 0.8 / d) ));
      vec3 S = texture2D(specular, uv).rgb;
      vec3 kS = 2.0 * pow(max(0.0, dot(normalize(N + L), -E)), 10.0) * S;
      gl_FragColor = vec4(kD + kS, 1);
    }`,vert:x`
    precision mediump float;
    attribute vec2 position;
    uniform vec2 lightPosition;
    varying vec3 lightDir, eyeDir;
    varying vec2 uv;
    void main () {
      vec2 P = 1.0 - 2.0 * position;
      uv = vec2(position.x, 1.0 - position.y);
      eyeDir = -vec3(P, 1);
      lightDir = vec3(lightPosition - P, 1);
      gl_Position = vec4(P, 0, 1);
    }`,attributes:{position:[-2,0,0,-2,2,2]},uniforms:{specular:h.specular,normals:h.normals,diffuse:h.diffuse,lightPosition({tick:r}){var a=.025*r;return[2*Math.cos(a),2*Math.sin(a)]}},count:3});v.frame(()=>{ar()});
