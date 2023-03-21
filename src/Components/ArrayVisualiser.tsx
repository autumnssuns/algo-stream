import { ComparableNumber } from "../Models/DataTypes";

interface ArrayVisualiserProps {
  array: ComparableNumber[];
  pointers?: { index: number; color: string }[];
}

const ArrayVisualiser: React.FC<ArrayVisualiserProps> = ({
  array,
  pointers,
}) => {
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {array.map((num, index) => {
        const pointer = pointers?.find((p) => p.index === index);
        return (
          <div
            key={index}
            style={{
              width: '50px',
              height: '50px',
              border: '1px solid black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              margin: '10px',
              position: 'relative',
            }}
          >
            {pointer && (
              <div
                style={{
                  position: 'absolute',
                  top: '75px',
                  left: '50%',
                  transform: 'translateX(-75%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '20px',
                  height: '20px',
                  // backgroundColor: pointer.color,
                  borderLeft: `5px solid ${pointer.color}`,
                  borderTop: `5px solid ${pointer.color}`,
                  borderBottom: `0`,
                  borderRight: `0`,
                  rotate: '45deg',
                }}
              ></div>
            )}
            {num.value}
          </div>
        );
      })}
    </div>
  );
};

export default ArrayVisualiser;