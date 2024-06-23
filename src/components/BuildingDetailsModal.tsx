import { Modal } from "antd";
import { BUILDING_TYPES } from "../constants/buildingTypes";
import { Building } from "../types/Building";
import { parseHouseNumber } from "../utils/parseHouseNumber";

type Props = {
  isModalOpen: boolean;
  modalData: Building | null;
  setModalData: (value: Building | null) => void;
};
export default function BuildingDetailsModal({
  isModalOpen,
  modalData,
  setModalData,
}: Props) {
  return (
    <Modal
      title={`Инфо о доме ${modalData?.unom}`}
      transitionName=""
      open={isModalOpen}
      footer={null}
      onCancel={() => setModalData(null)}
    >
      {modalData && (
        <div className="flex flex-col gap-4">
          <section>
            <h4 className="font-bold">Информация об объекте</h4>
            <hr></hr>
            <ul>
              <li>
                <h5 className="font-bold">Адрес</h5>
                <address className="not-italic">
                  {modalData.city}, {modalData.street || modalData.village}
                  {parseHouseNumber(modalData)}
                </address>
              </li>
              <li>
                <h5 className="font-bold">Тип объекта</h5>
                <p>
                  {BUILDING_TYPES[modalData.predication.usage_priority_type]}
                </p>
              </li>
              <li>
                <h5 className="font-bold">Прогнозируемая опасность</h5>
                <p>{modalData.predication.prediction}</p>
              </li>
            </ul>
          </section>
          <section>
            <h5 className="font-bold">Информация о предсказании</h5>
            <hr></hr>
            <ul>
              {modalData.predication.n_flats && (
                <li>
                  <h5 className="font-bold">Количество квартир</h5>
                  <address className="not-italic">
                    {modalData.predication.n_flats}
                  </address>
                </li>
              )}
              {modalData.predication.square && (
                <li>
                  <h5 className="font-bold">Площадь</h5>
                  <p>{modalData.predication.square} км²</p>
                </li>
              )}
              {modalData.predication.distance_to_moscow_center && (
                <li>
                  <h5 className="font-bold">Расстояние до центра Москвы</h5>
                  <p>{modalData.predication.distance_to_moscow_center} км</p>
                </li>
              )}
              {modalData.predication.assignment_structure && (
                <li>
                  <h5 className="font-bold">Вид постройки</h5>
                  <p>{modalData.predication.assignment_structure}</p>
                </li>
              )}
              {modalData.predication.material && (
                <li>
                  <h5 className="font-bold">Материал стен</h5>
                  <p>{modalData.predication.material}</p>
                </li>
              )}
            </ul>
          </section>
        </div>
      )}
    </Modal>
  );
}
