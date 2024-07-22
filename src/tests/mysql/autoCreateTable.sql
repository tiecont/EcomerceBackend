SELECT NOW();
SHOW EVENTS;

-- CREATE EVENT
CREATE EVENT
	`create_table_auto_month_event`
ON SCHEDULE EVERY
	1 MONTH
STARTS 
	'2024-07-21 05:13:02'
ON COMPLETION
	PRESERVE ENABLE -- không xoá bỏ count thời gian khi thực hiện xong
DO
	CALL create_table_auto_month();

	