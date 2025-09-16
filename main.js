(() => {
	const $ = document.querySelector.bind(document);

	let timeRotate = 3000; //7 giây
	let currentRotate = 0;
	let isRotating = false;
	let indexSpin = 0;
	let indexResult = 0;
	const wheel = $('.wheel');
	const btnWheel = $('.wheel-container');
	// const showMsg = $('.msg');
	const resultTableBody = document.getElementById('result-table-body');

	//=====< Danh sách phần thưởng >=====
	const listGift = [];
	let availableGifts = [];
	const total = 15; // Tổng số phần thưởng
	const giftValue = ['5%', '10%', '15%'];

	// Định nghĩa kết quả cố định cho từng lần quay
	const fixedResults = {
		1: '10%',
		4: '15%',
		9: '10%',
		13: '15%',
		18: '10%',
		26: '15%',
		32: '10%',
		39: '15%',
		45: '10%',
		55: '15%'
	};

	for (let i = 0; i < total; i++) {
		listGift.push({
			text: giftValue[i % 3],
			percent: (100 / total) / 100
		});
	}

	// Reset availableGifts khi load lại trang
	availableGifts = [...listGift];

	//=====< Số lượng phần thưởng >=====
	const size = listGift.length;

	//=====< Số đo góc của 1 phần thưởng chiếm trên hình tròn >=====
	const rotate = 360 / size;

	//=====< Số đo góc cần để tạo độ nghiêng, 90 độ trừ đi góc của 1 phần thưởng chiếm >=====
	const skewY = 90 - rotate;

	listGift.map((item, index) => {
		//=====< Tạo thẻ li >=====
		const elm = document.createElement('li');

		//=====< Xoay và tạo độ nghiêng cho các thẻ li >=====
		elm.style.transform = `rotate(${rotate * index}deg) skewY(-${skewY}deg)`;

		//=====< Thêm background-color so le nhau và căn giữa cho các thẻ text>=====
		const textClass = `text text-${(index % 3) + 1}`;
		elm.innerHTML = `<p style="transform: skewY(${skewY}deg) rotate(${rotate / 2}deg);" class="${textClass}">
		<b>${item.text}</b>
		</p>`;

		//=====< Thêm vào thẻ ul >=====
		wheel.appendChild(elm);
	});

	/********** Hàm bắt đầu **********/
	const start = async () => {
		// // Reset bảng kết quả
		// resultTableBody.innerHTML = '';
		isRotating = true;
		let results = [];
		let localRotate = currentRotate;
		wheel.style.transition = 'cubic-bezier(0.1, 0.9, 0.1, 1) 10s';
		timeRotate = 10000;

		// Kiểm tra xem lần quay hiện tại có kết quả cố định không
		const currentSpinNumber = indexSpin + 1;
		let selectedGift;

		if (fixedResults[currentSpinNumber]) {
			// Sử dụng kết quả cố định
			selectedGift = { text: fixedResults[currentSpinNumber] };
		} else {
			// Nếu không phải kết quả cố định thì cho "không trúng"
			selectedGift = { text: '5%' };
		}

		localRotate += 360 * 5;

		// Tìm tất cả các vị trí của giá trị được chọn trên vòng quay
		const targetPositions = [];
		listGift.forEach((gift, index) => {
			if (gift.text === selectedGift.text) {
				targetPositions.push(index);
			}
		});
		// Chọn ngẫu nhiên một vị trí trong số các vị trí phù hợp
		const targetIndex = targetPositions[Math.floor(Math.random() * targetPositions.length)];

		await rotateWheelAsync(localRotate, targetIndex);
		results.push(selectedGift.text);
		indexSpin++;
		indexResult++;
		// addResultToTable(indexResult, selectedGift.text);

		// Hiện popup chúc mừng
		let popupOverlay = document.createElement('div');
		popupOverlay.className = 'overlay-result';
		popupOverlay.id = 'popup-congrats-overlay';
		let popup = document.createElement('div');
		popup.className = 'popup-congrats';
		popup.innerHTML = `
			  <button id="close-popup-congrats" class="close-popup-congrats">×</button>
			  <div class="popup-congrats-title">Xin chúc mừng! <br> Quý Anh/Chị đã nhận được VOUCHER ${selectedGift.text} từ NOBLECO</div>
			`;
		popupOverlay.appendChild(popup);
		document.body.appendChild(popupOverlay);
		document.getElementById('close-popup-congrats').onclick = function () {
			popupOverlay.remove();
		};

		currentRotate = localRotate;
	};

	/********** Hàm quay vòng quay **********/
	const rotateWheel = (currentRotate, index) => {
		//=====< Góc quay hiện tại trừ góc của phần thưởng>=====
		//=====< Trừ tiếp cho một nửa góc của 1 phần thưởng để đưa mũi tên về chính giữa >=====
		$('.wheel').style.transform = `rotate(${currentRotate - index * rotate - rotate / 2}deg)`;
	};

	// Hàm quay có delay để dùng với await
	const rotateWheelAsync = (currentRotate, index) => {
		return new Promise(resolve => {
			rotateWheel(currentRotate, index);
			setTimeout(resolve, timeRotate);
		});
	};

	/********** Sự kiện click button start **********/
	btnWheel.addEventListener('click', () => {
		!isRotating && start();
	});
})();
