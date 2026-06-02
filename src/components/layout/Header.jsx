// 헤더 레이아웃 선언
import { dummyUser } from '../../data/dummyUser'
import '../../styles/layout.css'

export default function Header() {
  return (
    <div className="header">
      <span className="header__title">준또배기</span>
      <div className="header__user">
        <div className="header__user-info">
          <div className="header__user-name">{dummyUser.name}</div>
          <div className="header__user-team">{dummyUser.team}</div>
        </div>
        <div className="header__avatar">{dummyUser.name[0]}</div>
      </div>
    </div>
  )
}
