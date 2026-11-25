"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, ArrowUp, Bookmark, Flag, MapPin, Search, Target, BookOpen, CloudSun, CalendarDays } from "lucide-react";
import facilities from "./facilities";

const categories = ["전체", "같은 건물", "골프 피팅", "골프장", "연습장", "라운드 준비"];
const resources = [
  ...facilities.map((facility) => ({
    ...facility,
    category: facility.category ?? "연습장",
    icon: MapPin,
    href: `https://map.naver.com/p/search/${encodeURIComponent(facility.title)}`,
  })),
  { id: "courses", category: "골프장", title: "내 주변 골프장 찾기", copy: "지도에서 골프장 위치와 이용 정보를 확인하세요.", icon: MapPin, href: "https://map.naver.com/p/search/골프장" },
  { id: "practice", category: "연습장", title: "가까운 골프 연습장", copy: "실내외 연습장과 스크린 골프장을 찾아보세요.", icon: Target, href: "https://map.naver.com/p/search/골프%20연습장" },
  { id: "rules", category: "라운드 준비", title: "골프 규칙 살펴보기", copy: "라운드 전에 공식 골프 규칙을 확인하세요.", icon: BookOpen, href: "https://www.randa.org/ko-KR/rog/the-rules-of-golf" },
  {
    id: "weather",
    category: "라운드 준비",
    title: "골프장 날씨",
    copy: "네이버에서 부산 골프장별 강수와 바람 예보를 찾아보세요.",
    keywords: "골프장날씨 라운드 날씨 라운드날씨",
    icon: CloudSun,
    href: `https://search.naver.com/search.naver?query=${encodeURIComponent("부산 골프장 날씨")}`,
  },
  { id: "public", category: "골프장", title: "퍼블릭 골프장 찾기", copy: "일반 이용이 가능한 골프장을 지도에서 찾아보세요.", icon: Flag, href: "https://map.naver.com/p/search/퍼블릭%20골프장" },
  { id: "checklist", category: "라운드 준비", title: "첫 라운드 체크리스트", copy: "출발 전 챙길 준비물과 확인 사항을 살펴보세요.", icon: CalendarDays, href: "#checklist" },
];

export default function Portal() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [saved, setSaved] = useState([]);
  const [savedOnly, setSavedOnly] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("brgolf-bookmarks"));
      if (Array.isArray(stored)) setSaved(stored.filter((id) => resources.some((resource) => resource.id === id)));
    } catch {}
  }, []);

  function toggleSaved(id) {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem("brgolf-bookmarks", JSON.stringify(next)); } catch {}
  }

  function showSaved() {
    setSavedOnly(true);
    setCategory("전체");
    setQuery("");
  }

  const terms = query.trim().toLowerCase().split(/\s+/);
  const results = resources.filter((resource) =>
    (category === "전체" || (category === "같은 건물" ? resource.inBuilding : resource.category === category)) &&
    (!savedOnly || saved.includes(resource.id)) &&
    terms.every((term) => [resource.title, resource.category, resource.copy, resource.district, resource.address, resource.keywords].join(" ").toLowerCase().includes(term))
  );

  return (
    <>
      <header className="top"><div className="shell header">
        <a href="#" className="brand"><Flag size={19} aria-hidden="true" /> BR<span>GOLF</span></a>
        <nav aria-label="주 메뉴">
          <a href="#directory" onClick={() => { setSavedOnly(false); setCategory("전체"); setQuery(""); }}>골프 디렉터리</a>
          <a href="#checklist">라운드 준비</a>
        </nav>
        <a className="favorite" href="#directory" onClick={showSaved}><Bookmark size={16} aria-hidden="true" /> 즐겨찾기</a>
      </div></header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow">부산 · 사직동</p>
            <h1 id="hero-title">BR Golf</h1>
            <p className="intro">사직 자이언츠파크에서 시작하는 골프 가이드</p>
            <a className="hero-link" href="#directory">골프 시설 둘러보기 <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="directory shell" id="directory" aria-labelledby="directory-title">
          <div className="directory-heading">
            <h2 id="directory-title">{savedOnly ? "즐겨찾기" : "골프 디렉터리"}</h2>
            {!savedOnly && <p className="copy">사직 자이언츠파크 입점 업체를 먼저 소개합니다.</p>}
          </div>
          <form className="search" role="search" onSubmit={(event) => {
            event.preventDefault();
            document.getElementById("directory-results").scrollIntoView({ block: "nearest" });
          }}>
            <Search size={19} aria-hidden="true" />
            <input type="search" aria-label="포털 정보 검색" placeholder="시설명, 동네, 골프장 날씨 검색" value={query} onChange={(event) => { setQuery(event.target.value); setCategory("전체"); setSavedOnly(false); }} />
            <button type="submit">검색</button>
          </form>
          <div className="filters" aria-label="카테고리">
            {categories.map((item) => <button type="button" key={item} aria-pressed={!savedOnly && category === item} onClick={() => { setCategory(item); setSavedOnly(false); }}>{item}</button>)}
          </div>
          <p className="count" id="directory-results" role="status">{query.trim() && `‘${query.trim()}’ 검색 결과 `}{results.length}개 항목</p>
          {results.length === 0 && <p className="empty">{savedOnly ? "저장한 항목이 없습니다." : "검색 결과가 없습니다. 다른 검색어나 카테고리를 선택해 보세요."}</p>}
          <div className="cards">
            {results.map(({ id, title, copy, category: label, icon: Icon, href, address, district, inBuilding }) => (
              <article className="card" key={id}>
                <div className="card-top">
                  <span className="tile"><Icon size={22} aria-hidden="true" /></span>
                  <button type="button" className="bookmark" aria-label={title + " 즐겨찾기"} aria-pressed={saved.includes(id)} onClick={() => toggleSaved(id)}><Bookmark size={20} aria-hidden="true" /></button>
                </div>
                <p className="category">{label}{inBuilding ? " · 자이언츠파크" : district && ` · ${district}`}</p>
                {address ? (
                  <>
                    <h3>{title}</h3>
                    <p className="copy">{address}</p>
                    <a className="map-link" href={href} aria-label={`${title} 네이버 지도에서 보기`}>네이버 지도에서 보기 <ArrowUpRight size={15} aria-hidden="true" /></a>
                  </>
                ) : (
                  <>
                    <h3><a href={href}>{title} <ArrowUpRight size={17} aria-hidden="true" /></a></h3>
                    <p className="copy">{copy}</p>
                  </>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="checklist shell" id="checklist" aria-labelledby="checklist-title">
          <div><p className="eyebrow">라운드 준비</p><h2 id="checklist-title">첫 라운드 체크리스트</h2></div>
          <ul>
            <li>티오프 시간과 골프장 도착 권장 시간을 확인하세요.</li>
            <li>클럽, 골프화, 장갑, 공과 티를 챙기세요.</li>
            <li>골프장 복장 규정과 당일 날씨를 확인하세요.</li>
          </ul>
        </section>
      </main>
      <footer className="shell footer"><span className="brand">BR GOLF</span><a href="#">맨 위로 <ArrowUp size={15} aria-hidden="true" /></a></footer>
    </>
  );
}
