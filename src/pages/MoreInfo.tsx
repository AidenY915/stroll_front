import React, { useState, useEffect } from "react";
import "./MoreInfo.css";

interface BoardItem {
  id: number;
  title: string;
  content: string;
  createdDate: string;
}

const MoreInfo: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("notice");
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null);

  // 더미 데이터
  const noticeData: BoardItem[] = [
    {
      id: 1,
      title: "서비스 이용 안내",
      content: "산책갈까 서비스 이용에 대한 안내사항입니다.",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      title: "시스템 점검 안내",
      content: "정기 시스템 점검으로 인한 서비스 일시 중단 안내입니다.",
      createdDate: "2024-01-10",
    },
  ];

  const faqData: BoardItem[] = [
    {
      id: 1,
      title: "회원가입은 어떻게 하나요?",
      content: "상단의 로그인 버튼을 클릭하여 회원가입을 진행하실 수 있습니다.",
      createdDate: "2024-01-01",
    },
    {
      id: 2,
      title: "장소 등록은 어떻게 하나요?",
      content:
        "로그인 후 '내 주변' 페이지에서 '새 장소 등록' 버튼을 클릭하세요.",
      createdDate: "2024-01-01",
    },
  ];

  const qnaData: BoardItem[] = [
    {
      id: 1,
      title: "문의사항이 있습니다",
      content: "서비스 이용 중 궁금한 점이 있으시면 언제든 문의해주세요.",
      createdDate: "2024-01-20",
    },
  ];

  useEffect(() => {
    switch (activeMenu) {
      case "notice":
        setBoardItems(noticeData);
        break;
      case "faq":
        setBoardItems(faqData);
        break;
      case "qna":
        setBoardItems(qnaData);
        break;
      default:
        setBoardItems(noticeData);
    }
    setSelectedItem(null);
  }, [activeMenu]);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleItemClick = (item: BoardItem) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  const getMenuTitle = () => {
    switch (activeMenu) {
      case "notice":
        return "공지사항";
      case "faq":
        return "자주 묻는 질문";
      case "qna":
        return "문의 사항";
      default:
        return "공지사항";
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>{getMenuTitle()}</h1>
        </div>
      </header>

      <div className="container">
        <aside className="sideLnb">
          <ul>
            <li
              className={activeMenu === "notice" ? "active" : ""}
              onClick={() => handleMenuClick("notice")}
            >
              공지사항
            </li>
            <li
              className={activeMenu === "faq" ? "active" : ""}
              onClick={() => handleMenuClick("faq")}
            >
              자주 묻는 질문
            </li>
            <li
              className={activeMenu === "qna" ? "active" : ""}
              onClick={() => handleMenuClick("qna")}
            >
              문의 사항
            </li>
          </ul>
        </aside>

        <section className="content">
          <h3>{getMenuTitle()}</h3>
          <hr />

          <ul className="boardUl">
            {boardItems.map((item) => (
              <li key={item.id} onClick={() => handleItemClick(item)}>
                <div className="boardContainer">
                  <p className="boardTitle">
                    {item.title}
                    <span className="createdDate">{item.createdDate}</span>
                  </p>

                  {selectedItem?.id === item.id && (
                    <div className="boardContent">
                      <p>{item.content}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {boardItems.length === 0 && (
            <p
              style={{ textAlign: "center", marginTop: "50px", color: "#666" }}
            >
              등록된 게시글이 없습니다.
            </p>
          )}
        </section>
      </div>
    </>
  );
};

export default MoreInfo;
