// Write your code here
import './index.css'
import {Component} from 'react'

const constantsLanguages = {
  Telugu: ['te-IN', 'te'],
  Hindi: ['hi-IN', 'hi'],
  Tamil: ['ta-IN', 'ta'],
  English: ['en-IN', 'en'],
  Malyalam: ['ml-IN', 'ml'],
  Kanada: ["kn-IN", "kn"]
}

const constantsOptions = ['Telugu', 'Hindi', 'Tamil', 'English', 'Malyalam', "Kanada"]

class Speech extends Component {
  state = {inLanguage: 'Telugu', outLanguage: 'English', recognitionText: ''}

  InLanguageChange = event => {
    const onChangeLang = event.target.value
    this.setState({inLanguage: onChangeLang})
  }

  OutLanguageChange = event => {
    const onChangeLang = event.target.value
    this.setState({outLanguage: onChangeLang})
  }

  SpeechRecognition = () => {
    const {inLanguage} = this.state
    const [a] = constantsLanguages[inLanguage]

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    // console.log(SpeechRecognition)

    const recognition = new SpeechRecognition()
    recognition.lang = a // Telugu language
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log('Speech recognition service has started')
    }

    recognition.onresult = async event => {
      // console.log('work')
      const recognizedText = event.results[0][0].transcript
      // console.log(recognizedText)
      await this.setState({recognitionText: `Recognized: ${recognizedText}`})
    }

    recognition.onend = () => {
      console.log('Speech recognition service disconnected')
    }

    recognition.start()
  }

  speakText = text => {
    const {inLanguage, outLanguage} = this.state

    const outLang = constantsLanguages[outLanguage]
    const textTrans2 = outLang[1]
    const langTarns = outLang[0]
    const InLang = constantsLanguages[inLanguage]
    const textTarns1 = InLang[1]

    this.translateText(text, `${textTarns1}|${textTrans2}`)
      .then(translatedText => {
        const t = translatedText
        console.log(t)
        const utterance = new window.SpeechSynthesisUtterance(t)
        utterance.lang = langTarns // Ensure English languag

        // Speak the text
        window.speechSynthesis.speak(utterance)

        // Speak the text
      })
      .catch(error => {
        console.error('Error:', error)
      })

    console.log(text)
  }

  translateText = async (text, langpair) => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text,
    )}&langpair=${langpair}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Translation request failed')
    }

    const data = await response.json()
    return data.responseData.translatedText
  }

  SpeechPlay = () => {
    const {recognitionText} = this.state
    const recognizedText = recognitionText.replace('Recognized: ', '')
    console.log(recognizedText)
    if (recognizedText) {
      console.log('click')
      this.speakText(recognizedText)
    }
  }

  render() {
    const {inLanguage, outLanguage, recognitionText} = this.state
    console.log(recognitionText)
    return (
      <div className="container">
        <h1>Speech Translator</h1>
        <select onChange={this.InLanguageChange} id="inputLanguage">
          {constantsOptions.map(l => (
            <option key={l} value={l} selected = {inLanguage === l}>
              {l}
            </option>
          ))}
        </select>
        <button type="button" onClick={this.SpeechRecognition}>
          Start Recognition
        </button>

        <p id="recognized-text">{recognitionText}</p>
        <select onChange={this.OutLanguageChange} id="outputLanguage">
          {constantsOptions.map(l => (
            <option key={l} selected = {outLanguage === l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button type="button" onClick={this.SpeechPlay}>
          Play Recognized Text
        </button>
      </div>
    )
  }
}

export default Speech
