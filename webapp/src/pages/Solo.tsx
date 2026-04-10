import { useParams } from 'react-router-dom';
import '../styles/solo.css';
import Game from "../components/Game";

function Solo() {
    const { pseudo = '' } = useParams<{ pseudo: string }>();

    return (
        <div>
            <Game mode="solo" pseudo={pseudo} />
        </div>
    );
}

export default Solo;