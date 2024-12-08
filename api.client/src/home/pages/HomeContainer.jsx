import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BoardRepository from '../../boards/repositories/BoardRepository'

function HomeContainer() {
  const navigate = useNavigate();

  useEffect(() => {    
    const boardId = BoardRepository.getDefaultBoard().id;
    navigate(`/boards/${boardId}`);
  }, [navigate]);

  return null;
}

export default HomeContainer;