import React from 'react'
import CheckIcon from 'react-icons/lib/fa/check-circle'

const Footer = () => (
  <footer
    className="navbar fixed-bottom text-muted"
    style={{
      backgroundColor: '#efefef',
    }}
  >
    <div>
      Tous les examens publiés sont vérfiés <CheckIcon size="20" color="green"/>{' '}
    </div>
    <div>© copyright Scorpion Group</div>
  </footer>
)

export default Footer
