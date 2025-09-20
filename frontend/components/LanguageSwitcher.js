import { useTranslation } from 'react-i18next';
import { Dropdown } from 'react-bootstrap';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ur', name: 'اردو' },
    { code: 'ks', name: 'कॉशुर' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language)?.name || 'English';

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-language">
        {currentLanguage}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {languages.map((lang) => (
          <Dropdown.Item 
            key={lang.code} 
            onClick={() => changeLanguage(lang.code)}
          >
            {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;