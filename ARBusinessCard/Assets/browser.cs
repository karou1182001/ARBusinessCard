using UnityEngine;
public class OpenUrlClick : MonoBehaviour {
  public string Url="https://example.com"; Camera cam;
  void Awake(){ cam=Camera.main; }
  void Update(){
    if (!Input.GetMouseButtonDown(0)) return;
    var ray=cam.ScreenPointToRay(Input.mousePosition);
    if (Physics.Raycast(ray, out var hit) && hit.collider.gameObject==gameObject)
      Application.OpenURL(Url);
  }
}