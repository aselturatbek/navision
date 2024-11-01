import React from 'react';
import Svg, { Path } from 'react-native-svg'; // react-native-svg'den import

const EditIcon = () => {
  return (
    <Svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M2.44328 9.40157L8.67223 3.17263L7.80379 2.30419L1.57484 8.53313V9.40157H2.44328ZM2.95243 10.6299H0.346497V8.02398L7.36957 1.00091C7.48474 0.885773 7.64093 0.821091 7.80379 0.821091C7.96664 0.821091 8.12283 0.885773 8.23801 1.00091L9.9755 2.73841C10.0906 2.85358 10.1553 3.00977 10.1553 3.17263C10.1553 3.33549 10.0906 3.49167 9.9755 3.60685L2.95243 10.6299ZM0.346497 11.8583H11.4016V13.0866H0.346497V11.8583Z"
        fill="black"
      />
    </Svg>
  );
};

export default EditIcon;
