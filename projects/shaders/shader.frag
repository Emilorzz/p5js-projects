#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
// uniform float u_mouse;


vec3 palette(float t) {
    vec3 a = vec3(0.509, 0.192, 0.803);
    vec3 b = vec3(0.938, 0.537, 0.100);
    vec3 c = vec3(0.356, 1.281, 1.376);
    vec3 d = vec3(3.913, 2.578, 3.685);

    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    vec2 uv0 = uv;

    vec3 finalColor = vec3(0.0);

    for (float i = 0.0; i < 3.0; i++) {
        uv = fract(uv * 1.75) - 0.5;

        float d = pow(0.02 / (abs(sin((length(uv) * exp(-length(uv0))) * 8.0 + u_time * 3.0) / 8.0)), 2.0);

        vec3 col = palette(length(uv0) + i * 0.4 + u_time * 0.1);

        finalColor += col * d;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}