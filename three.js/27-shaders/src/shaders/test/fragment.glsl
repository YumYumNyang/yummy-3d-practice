precision mediump float;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

uniform vec3 uColor;
uniform sampler2D uTexture;



void main()
{
    // vec4 textureColor = texture2D(uTexture, vUv);
    // textureColor.rgb *= vElevation + 0.6;
    // gl_FragColor = textureColor;
    // gl_FragColor = vec4(0, vRandom*0.4, 1.0, 1.0);
    gl_FragColor = vec4(vUv, 1.0, 1.0);
}