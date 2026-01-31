<script>
        let packageData = null;

        function saveAndGenerate() {
            const sPhone = document.getElementById('senderPhone').value;
            const rPhone = document.getElementById('receiverPhone').value;
            const loc = document.getElementById('location').value;

            if(!rPhone) return alert("សូមបញ្ចូលលេខអ្នកទទួល!");

            const id = "SMS" + Math.floor(10000 + Math.random() * 90000);
            packageData = { id, sPhone, rPhone, loc, status: "កំពុងរៀបចំចេញដំណើរ" };

            document.getElementById('trackingID').innerText = id;
            document.getElementById('qrcode').innerHTML = ""; 
            new QRCode(document.getElementById("qrcode"), { text: id, width: 130, height: 130 });

            document.getElementById('id-display-area').classList.remove('hidden');
            document.getElementById('btnSave').classList.add('hidden');
            document.getElementById('btnGoToSearch').classList.remove('hidden');
        }

        // មុខងារស្វែងរកបែប Universal (ស្វែងរកបានគ្រប់ទិន្នន័យ)
        function searchPackage() {
            const input = document.getElementById('searchInput').value.trim();
            const resArea = document.getElementById('resultArea');
            
            if(!input) return alert("សូមបញ្ចូលអ្វីមួយដើម្បីស្វែងរក!");

            resArea.classList.remove('hidden');
            
            // ប្រសិនបើស្មើនឹងទិន្នន័យដែលទើបបង្កើត
            if(packageData && (input === packageData.id || input === packageData.rPhone)) {
                document.getElementById('resDetail').innerHTML = `
                    <b>លេខកូដ:</b> ${packageData.id}<br>
                    <b>អាសយដ្ឋាន:</b> ${packageData.loc}<br>
                    <b>ស្ថានភាព:</b> <span class="text-green-600">ក្នុងប្រព័ន្ធ</span>
                `;
            } else {
                
                document.getElementById('resDetail').innerHTML = `
                    <b>លេខកូដ:</b> ${input}<br>
                    <b>អាសយដ្ឋាន:</b> ភ្នំពេញ <br>
                    <b>ស្ថានភាព:</b> <span class="text-orange-500">កំពុងដឹកជញ្ជូន (Mock Data)</span>
                `;
            }
        }

        // មុខងារអាន QR ពីការ Upload រូបភាព
        function handleQRUpload(input) {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (code) {
                        document.getElementById('searchInput').value = code.data;
                        alert("រកឃើញកូដ៖ " + code.data);
                        searchPackage();
                    } else {
                        alert("មិនអាចអាន QR នេះបានទេ សូមព្យាយាមម្តងទៀត!");
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function showPage(id) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }
    </script>