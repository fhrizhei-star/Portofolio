const $ = (s) => document.querySelectorAll(s),
        R = matchMedia("(prefers-reduced-motion:reduce)").matches;
      // split text
      $(".sp").forEach((el) => {
        let i = 0;
        const t = el.textContent;
        el.textContent = "";
        t.split(" ").forEach((w) => {
          const s = document.createElement("span");
          s.className = "w";
          [...w].forEach((ch) => {
            const c = document.createElement("span");
            c.className = "c";
            c.style.setProperty("--i", i++);
            c.textContent = ch;
            s.appendChild(c);
          });
          el.appendChild(s);
          el.append(" ");
        });
      });
      // loader
      const pc = document.getElementById("pc"),
        ld = document.getElementById("ld");
      let n = 0;
      function done() {
        ld.classList.add("done");
        document.body.classList.add("ready");
      }
      if (R) {
        done();
      } else {
        const id = setInterval(() => {
          n += Math.ceil(Math.random() * 7);
          if (n >= 100) {
            n = 100;
            clearInterval(id);
            setTimeout(done, 300);
          }
          pc.textContent = n;
          ld.style.setProperty("--p", n / 100);
          document.getElementById("lp").style.setProperty("--p", n / 100);
        }, 50);
      }
      // cursor tracking for background particles
      let mx = innerWidth / 2,
        my = innerHeight / 2;
      addEventListener("pointermove", (e) => {
        mx = e.clientX;
        my = e.clientY;
      });
      // particle network
      const cv = document.getElementById("net"),
        cx = cv.getContext("2d");
      let P = [];
      function rs() {
        cv.width = innerWidth;
        cv.height = innerHeight;
        P = Array.from({ length: Math.min(70, (innerWidth / 18) | 0) }, () => ({
          x: Math.random() * cv.width,
          y: Math.random() * cv.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        }));
      }
      rs();
      addEventListener("resize", rs);
      function net() {
        const c = getComputedStyle(document.documentElement)
          .getPropertyValue("--pc")
          .trim();
        cx.clearRect(0, 0, cv.width, cv.height);
        P.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > cv.width) p.vx *= -1;
          if (p.y < 0 || p.y > cv.height) p.vy *= -1;
          const dx = mx - p.x,
            dy = my - p.y,
            d = Math.hypot(dx, dy);
          if (d < 160) {
            p.x += dx * 0.012;
            p.y += dy * 0.012;
          }
          cx.fillStyle = "rgba(" + c + ",.7)";
          cx.beginPath();
          cx.arc(p.x, p.y, 2, 0, 7);
          cx.fill();
          for (let j = i + 1; j < P.length; j++) {
            const q = P[j],
              l = Math.hypot(p.x - q.x, p.y - q.y);
            if (l < 130) {
              cx.strokeStyle = "rgba(" + c + "," + 0.28 * (1 - l / 130) + ")";
              cx.beginPath();
              cx.moveTo(p.x, p.y);
              cx.lineTo(q.x, q.y);
              cx.stroke();
            }
          }
        });
        requestAnimationFrame(net);
      }
      if (!R) net();
      // reveal
      const io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.12 },
      );
      $(".rv").forEach((e) => io.observe(e));
      // scroll: progress + marquee skew
      let ly = scrollY;
      const mq = document.getElementById("mq"),
        bar = document.getElementById("bar");
      addEventListener(
        "scroll",
        () => {
          bar.style.width =
            (scrollY / (document.body.scrollHeight - innerHeight)) * 100 + "%";
          const v = Math.max(-12, Math.min(12, (scrollY - ly) * 0.35));
          ly = scrollY;
          mq.style.setProperty("--sk", v + "deg");
          clearTimeout(mq.t);
          mq.t = setTimeout(() => mq.style.setProperty("--sk", "0deg"), 120);
        },
        { passive: true },
      );
      // buttons
      $(".btn").forEach((b) => {
        b.addEventListener("pointermove", (e) => {
          const r = b.getBoundingClientRect();
          b.style.setProperty("--x", e.clientX - r.left + "px");
          b.style.setProperty("--y", e.clientY - r.top + "px");
          b.style.transform =
            "translate(" +
            (e.clientX - r.left - r.width / 2) / 8 +
            "px," +
            (e.clientY - r.top - r.height / 2) / 5 +
            "px)";
        });
        b.addEventListener("pointerleave", () => (b.style.transform = ""));
        b.addEventListener("click", (e) => {
          const r = b.getBoundingClientRect(),
            s = document.createElement("span"),
            d = Math.max(r.width, r.height) / 5;
          s.className = "rp";
          s.style.cssText =
            "width:" +
            d +
            "px;height:" +
            d +
            "px;left:" +
            (e.clientX - r.left - d / 2) +
            "px;top:" +
            (e.clientY - r.top - d / 2) +
            "px";
          b.appendChild(s);
          setTimeout(() => s.remove(), 600);
        });
      });
      // tilt
      $(".card").forEach((c) => {
        c.addEventListener("pointermove", (e) => {
          const r = c.getBoundingClientRect();
          c.style.setProperty(
            "--ry",
            ((e.clientX - r.left) / r.width - 0.5) * 8 + "deg",
          );
          c.style.setProperty(
            "--rx",
            -((e.clientY - r.top) / r.height - 0.5) * 8 + "deg",
          );
        });
        c.addEventListener("pointerleave", () => {
          c.style.setProperty("--rx", "0deg");
          c.style.setProperty("--ry", "0deg");
        });
      });
      // reel & video player (Landscape & Potret Support & YouTube Integration)
      const reel = document.getElementById("reel"),
        vPlayer = document.getElementById("main-video"),
        vBg = document.getElementById("bg-video"),
        ytPlayer = document.getElementById("yt-player"),
        ytExit = document.getElementById("yt-exit"),
        pb = document.getElementById("pb"),
        pr = document.getElementById("pr"),
        pi = document.getElementById("pi"),
        tc = document.getElementById("tc");
      let t = 0,
        play = false,
        T = 80,
        lt = performance.now();
      const z = (v) => String(Math.floor(v)).padStart(2, "0");

      (function lp(now) {
        const dt = (now - lt) / 1000;
        lt = now;
        if (!vPlayer.src && play && !reel.classList.contains("yt-mode")) {
          t = (t + dt) % T;
          tc.textContent =
            z((t / 60) | 0) + ":" + z((t % 60) | 0) + ":" + z(((t % 1) * 24) | 0);
          pi.style.width = (t / T) * 100 + "%";
        }
        requestAnimationFrame(lp);
      })(lt);

      vPlayer.addEventListener("timeupdate", () => {
        if (vPlayer.duration) {
          const cur = vPlayer.currentTime;
          tc.textContent = `00:${z(cur / 60)}:${z(cur % 60)}`;
          pi.style.width = (cur / vPlayer.duration) * 100 + "%";

          // Sinkronisasi background blur agar durasinya tepat sama
          if (vBg.src && Math.abs(vBg.currentTime - cur) > 0.3) {
            vBg.currentTime = cur;
          }
        }
      });

      vPlayer.addEventListener("ended", () => {
        pb.textContent = "▶";
        reel.classList.add("pause");
      });

      function stopYouTube() {
        if (ytPlayer) ytPlayer.src = "";
        reel.classList.remove("yt-mode");
      }

      if (ytExit) {
        ytExit.onclick = () => {
          stopYouTube();
          tog(false);
        };
      }

      function tog(v) {
        play = v;
        reel.classList.toggle("pause", !play);
        pb.textContent = play ? "❚❚" : "▶";

        if (vPlayer.src) {
          if (play) {
            vPlayer.play().catch(() => {});
            if (vBg.src) vBg.play().catch(() => {});
          } else {
            vPlayer.pause();
            if (vBg.src) vBg.pause();
          }
        }
      }

      pb.onclick = () => {
        if (reel.classList.contains("yt-mode")) return;
        if (!vPlayer.src) {
          const firstClip = $(".clip")[0];
          if (firstClip) {
            firstClip.click();
            return;
          }
        }
        tog(vPlayer.paused);
      };

      pr.onclick = (e) => {
        if (reel.classList.contains("yt-mode")) return;
        const r = pr.getBoundingClientRect();
        const ratio = (e.clientX - r.left) / r.width;
        if (vPlayer.src && vPlayer.duration) {
          const targetTime = ratio * vPlayer.duration;
          vPlayer.currentTime = targetTime;
          if (vBg.src) vBg.currentTime = targetTime;
        } else {
          t = ratio * T;
        }
      };

      $(".clip").forEach((c) => {
        const miniV = c.querySelector(".th video");

        // Hover untuk memutar cuplikan video mini secara halus
        if (miniV) {
          c.addEventListener("mouseenter", () => {
            miniV.play().catch(() => {});
          });
          c.addEventListener("mouseleave", () => {
            miniV.pause();
            miniV.currentTime = 0.5;
          });
        }

        // Klik untuk memutar di layar utama
        c.onclick = () => {
          document.getElementById("tt").textContent = c.dataset.t;
          reel.style.setProperty("--h", c.dataset.h || "0deg");

          if (c.dataset.yt) {
            // Hentikan video HTML5 jika sedang berputar
            tog(false);
            vPlayer.style.opacity = "0";
            vBg.style.opacity = "0";
            vPlayer.src = "";
            vBg.src = "";

            // Putar video YouTube di Iframe
            ytPlayer.src = `https://www.youtube.com/embed/${c.dataset.yt}?autoplay=1&rel=0`;
            const openLink = document.getElementById("yt-open-link");
            if (openLink) openLink.href = `https://youtu.be/${c.dataset.yt}`;
            reel.classList.add("yt-mode");
          } else if (c.dataset.video) {
            // Hentikan mode YouTube jika aktif
            stopYouTube();

            const videoSrc = c.dataset.video;
            vPlayer.src = videoSrc;
            vBg.src = videoSrc;
            vPlayer.style.opacity = "1";
            vBg.style.opacity = "0.75";
            tog(true);
          }
          reel.scrollIntoView({ behavior: "smooth", block: "center" });
        };
      });
      // theme, mail
      document.getElementById("theme").onclick = () => {
        const r = document.documentElement,
          dk =
            getComputedStyle(r).getPropertyValue("--bg").trim() === "#040a1c";
        r.dataset.theme = dk ? "light" : "dark";
      };
      const mail = document.getElementById("mail");
      mail.onclick = () => {
        const o = mail.innerHTML;
        try {
          navigator.clipboard.writeText("nama@email.com");
        } catch (e) {}
        mail.innerHTML = 'Email disalin <span class="o">✔</span>';
        setTimeout(() => (mail.innerHTML = o), 1600);
      };

      // ============================================
      // DESAIN GRAFIS: FILTER & LIGHTBOX MODAL
      // ============================================
      const filterBtns = $(".desain-btn");
      const desainCards = $(".desain-card");

      // Filter kategori
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const filter = btn.dataset.filter;

          desainCards.forEach((card) => {
            const cat = card.dataset.category;
            const match = filter === "all" || cat === filter;
            if (match) {
              card.style.display = "";
              requestAnimationFrame(() => {
                card.style.opacity = "1";
                card.style.transform = "";
              });
            } else {
              card.style.opacity = "0";
              card.style.transform = "scale(0.95)";
              setTimeout(() => {
                card.style.display = "none";
              }, 220);
            }
          });
        });
      });

      // Lightbox Modal
      const lbModal = document.getElementById("desain-lightbox");
      const lbImg = document.getElementById("lb-img");
      const lbTitle = document.getElementById("lb-title");
      const lbBadge = document.getElementById("lb-badge");
      const lbDesc = document.getElementById("lb-desc");
      const lbCounter = document.getElementById("lb-counter");
      const lbOpenTab = document.getElementById("lb-open-tab");
      const lbClose = document.getElementById("lb-close");
      const lbBackdrop = document.getElementById("lb-backdrop");
      const lbPrev = document.getElementById("lb-prev");
      const lbNext = document.getElementById("lb-next");

      if (lbModal && desainCards.length > 0) {
        let currentLbIndex = 0;
        const desainList = Array.from(desainCards).map((c) => ({
          title: c.dataset.title,
          badge: c.dataset.cat,
          desc: c.dataset.desc,
          img: c.dataset.img,
        }));

        function showLightbox(idx) {
          if (idx < 0) idx = desainList.length - 1;
          if (idx >= desainList.length) idx = 0;
          currentLbIndex = idx;

          const item = desainList[currentLbIndex];
          if (lbImg) {
            lbImg.style.opacity = "0";
            lbImg.style.transform = "scale(0.96)";
            setTimeout(() => {
              lbImg.src = item.img;
              lbImg.alt = item.title;
              if (lbTitle) lbTitle.textContent = item.title;
              if (lbBadge) lbBadge.textContent = item.badge;
              if (lbDesc) lbDesc.textContent = item.desc;
              if (lbCounter) lbCounter.textContent = `${currentLbIndex + 1} / ${desainList.length}`;
              if (lbOpenTab) lbOpenTab.href = item.img;
              lbImg.style.opacity = "1";
              lbImg.style.transform = "scale(1)";
            }, 100);
          }

          lbModal.classList.add("active");
          lbModal.setAttribute("aria-hidden", "false");
          document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
          lbModal.classList.remove("active");
          lbModal.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        }

        desainCards.forEach((c) => {
          c.addEventListener("click", () => {
            const idx = parseInt(c.dataset.index, 10);
            showLightbox(isNaN(idx) ? 0 : idx);
          });
          c.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const idx = parseInt(c.dataset.index, 10);
              showLightbox(isNaN(idx) ? 0 : idx);
            }
          });
        });

        if (lbClose) lbClose.addEventListener("click", closeLightbox);
        if (lbBackdrop) lbBackdrop.addEventListener("click", closeLightbox);
        if (lbPrev) lbPrev.addEventListener("click", (e) => {
          e.stopPropagation();
          showLightbox(currentLbIndex - 1);
        });
        if (lbNext) lbNext.addEventListener("click", (e) => {
          e.stopPropagation();
          showLightbox(currentLbIndex + 1);
        });

        window.addEventListener("keydown", (e) => {
          if (!lbModal.classList.contains("active")) return;
          if (e.key === "Escape") closeLightbox();
          if (e.key === "ArrowLeft") showLightbox(currentLbIndex - 1);
          if (e.key === "ArrowRight") showLightbox(currentLbIndex + 1);
        });
      }