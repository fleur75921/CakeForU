import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "./components/Header";
import ColContainer from "./components/layout/ColContainer";
import GapW from "./components/layout/GapW";
import GapH from "./components/layout/GapH";
import RecommendHeader from "./components/RecommendHeader";
import RecommendSidebar from "./components/RecommendSidebar";
import RowContainer from "./components/layout/RowContainer";
import Card from "./components/Card";
import Medium from "./components/text/Medium";
import Button1 from "./components/button/Button1";
import axios from "./util/axiosInstance";
import Loading from "./components/Loading";
import { closePortfolio } from "./store/modalSlice";
import PortfolioModal from "./components/PortfolioModal";

function RecommendWishlist() {
  const modal = useSelector((state) => state.modal);
  const loginUser = useSelector((state) => state.login.user);
  const dispatch = useDispatch();
  const [recommendMatrix, setRecommendMatrix] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const handleClickOutModal = () => {
    if (modal.portfolioOpen) {
      dispatch(closePortfolio());
    }
  };

  const cardPerRow = 5;

  function fetchPortfolios() {
    axios
      .get(
        `${process.env.REACT_APP_BACKEND_URL}/recommendation/wishlist?user-id=${loginUser.id}&page=${page}`
      )
      .then((res) => {
        const answer = [];
        const row = Math.floor(res.data.length / cardPerRow);
        const r = res.data.length % cardPerRow;
        for (let i = 0; i < row; i += 1) {
          answer.push(res.data.slice(i * cardPerRow, (i + 1) * cardPerRow));
        }
        if (r > 0) {
          answer.push(res.data.slice(row * cardPerRow, row * cardPerRow + r));
        }
        setRecommendMatrix(answer);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPortfolios();
  }, [page]);

  const load = () => {
    fetchPortfolios();
    window.scrollTo({
      top: 100,
      left: 100,
      behavior: "smooth",
    });
  };

  const loadMore = () => {
    const nextpage = page + 1;
    setPage(nextpage);
    load();
  };

  const loadPrev = () => {
    setPage(page - 1);
    load();
  };

  return (
    <div>
      <Header handleClickOutModal={handleClickOutModal} />
      {modal.portfolioOpen ? <PortfolioModal /> : null}
      <RecommendHeader />
      <RowContainer justify="start" align="start" onClick={handleClickOutModal}>
        <RecommendSidebar />
        <ColContainer>
          <GapH height="57px" />
          <RowContainer justify="start">
            <Medium># {loginUser.nickname}님의 위시리스트 기반</Medium>
            <GapW />
          </RowContainer>
          <GapH height="58px" />
          {loading ? <Loading /> : null}
          <ColContainer gap="50px">
            {recommendMatrix
              .slice(page * 2, page * 2 + 2)
              .map((recommendRow) => (
                <RowContainer>
                  {recommendRow.map((item) => (
                    <RowContainer>
                      <Card
                        buyerId={loginUser ? loginUser.id : null}
                        sellerId={item.sellerId}
                        portfolioId={item.id}
                        title={item.detail}
                        shape={item.shape}
                        sheetTaste={item.sheetTaste}
                        creamTaste={item.creamTaste}
                        situation={item.situation}
                        businessName={item.businessName}
                        size={item.size}
                        detail={item.detail}
                        imgUrl={item.imageUrl}
                        color={item.color}
                        createdAt={item.createdAt}
                        hit={item.hit}
                      />
                      <GapW width="20px" />
                    </RowContainer>
                  ))}
                </RowContainer>
              ))}
          </ColContainer>
          <GapH height="50px" />
          <RowContainer>
            {page !== 0 && (
              <Button1
                background="black"
                color="white"
                style={{ width: "100%" }}
                onClick={loadPrev}
              >
                이전 페이지
              </Button1>
            )}
            {page !== 0 && <GapW />}
            <Button1
              background="black"
              color="white"
              style={{ width: "100%" }}
              onClick={loadMore}
            >
              다음 페이지
            </Button1>
          </RowContainer>
          <GapH height="50px" />
        </ColContainer>
      </RowContainer>
    </div>
  );
}

export default RecommendWishlist;
