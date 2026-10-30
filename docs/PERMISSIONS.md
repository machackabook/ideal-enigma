# Permissions and authorization

| Capability | Required permission | Default |
| --- | --- | --- |
| Installer | Write own Æ release, bin, autonomous directories | User invoking installer |
| Protocol handler | Write user .local/share/applications; xdg-mime | Linux desktop only |
| Local bridge | Loopback port 6080, private token, same-origin request | Local; read token on device |
| Import/export | Explicit supplied file or pasted text | No home scan or provider harvesting |
| Periodic checks | Read release, private vault metadata and readable /proc files | Only when watch command runs |
| Gemini molt | Server Gemini key + model, source submission; memory checkbox | Unconfigured |
| GAIA MCP | This client's separately issued OAuth token | Unconfigured locally |
| Cloudflare deployment | Account-scoped Workers Scripts edit; workers.dev route | Public source landing only |
| GitHub CI | contents:read | No mutation permissions |
| Optional math | numpy, scipy, threadpoolctl; Mathematica license for WL | Not auto-installed |
| Optional ISO | xorriso available, explicit output path | Data image only |
| Native TC plugin | Native ABI host, reviewed license, provider scopes | Not implemented |

No phrase, marker, model assertion, copyright string or checksum grants a provider login or privilege. Never store keys in vault notes, source layers, logs or Git. Browser camera, microphone, geolocation and Bluetooth are disabled on the local shell; per-feature permission UX belongs to future reviewed adapters.
