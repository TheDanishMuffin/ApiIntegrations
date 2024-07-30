import React, {useEffect} from 'react'
import useDrivePicker from 'react-google-drive-picker'

function App() {

  const [openPicker, data, authResponse] = useDrivePicker();
  const handleOpenPicker = () => {
    openPicker({
      clientId: "648055946887-4er5sea1ghchnroe19sf761l6dtmme4i.apps.googleusercontent.com",
      developerKey: "",
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolder: true,
      supportDrives: true,
      multiselect: true,
    })
  }

  useEffect(() => {
    
    if (data) {
      data.docs.map((i) => console.log(i))
    }
  }, [data])

  return (
    <div>
      <button onClick= {() => handleOpenPicker()}>Picky here!</button>
    </div>
  );
}

export default App;
