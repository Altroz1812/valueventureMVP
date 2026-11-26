# P22 original package integration

All four runtime dependencies are actual npm packages, pinned in package.json. No upstream algorithm has been rewritten or vendored. App adapters, normalized sketch coordinates, inspection persistence and map queries are custom ValuationPro code. Package install and full build pending; inherited package-lock.json is intentionally not hand-edited.

| Repository | Version / upstream commit | License | Original API used |
|---|---|---|---|
| https://github.com/konvajs/react-konva | 19.0.10 / d8af5c2e8201a6739d6d6ee78e3d5be830c7ace5 | MIT | Stage, Layer, Rect, Line, Circle, Text and pointer/drag events |
| https://github.com/konvajs/konva | 10.0.12 / 752cdc3e935f05d53ef74636d58951d6f05dfeb7 | MIT | Canvas engine through React Konva |
| https://github.com/Leaflet/Leaflet | 1.9.4 / d15112c9e8ac339f0f74f563959d0423d291308d | BSD-2-Clause | map, circle, circleMarker, fitBounds, tooltip |
| https://github.com/geoman-io/leaflet-geoman | 2.18.0 / 025f7683ffce48a4fb8e63e77bbc602c43410b14 | MIT | map.pm.enableDraw('Polygon'), pm:create, disableDraw |

Upstream manifests and license files inspected at pinned commits. React Konva peer range accepts React/React DOM ^19.0.0 and Konva ^10.0.0. Geoman requires Leaflet ^1.2.0. @types/leaflet 1.9.16 is a separate dev dependency. License notices travel with installed packages; original license URLs:
- https://github.com/konvajs/react-konva/blob/d8af5c2e8201a6739d6d6ee78e3d5be830c7ace5/LICENSE
- https://github.com/konvajs/konva/blob/752cdc3e935f05d53ef74636d58951d6f05dfeb7/LICENSE
- https://github.com/Leaflet/Leaflet/blob/d15112c9e8ac339f0f74f563959d0423d291308d/LICENSE
- https://github.com/geoman-io/leaflet-geoman/blob/025f7683ffce48a4fb8e63e77bbc602c43410b14/LICENSE

Original upstream test suites not run. No commercial Geoman Pro package used. No external map tiles or geocoding requested. P22 does not calculate survey area, enforce geofence or replace official report release.
