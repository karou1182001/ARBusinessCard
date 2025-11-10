using UnityEngine;

[RequireComponent(typeof(Collider), typeof(Renderer))]
public class Button3DLink : MonoBehaviour
{
    [Header(" URL to open when pressed")]
    [Tooltip("Enter the link that should open when this button is pressed.")]
    public string url = "https://yourwebsite.com";

    [Header("Visual feedback settings")]
    public Color pressedColor = Color.gray;
    public float pressedScale = 0.9f;
    public float feedbackDuration = 0.2f;

    private Renderer rend;
    private Color originalColor;
    private Vector3 originalScale;

    void Start()
    {
        rend = GetComponent<Renderer>();
        originalColor = rend.material.color;
        originalScale = transform.localScale;
    }

    void Update()
    {
        //  Touch detection (mobile)
        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.GetTouch(0).position);
            if (Physics.Raycast(ray, out RaycastHit hit) && hit.transform == transform)
                OnPressed();
        }

        //  Mouse click detection (PC or Editor)
        if (Input.GetMouseButtonDown(0))
        {
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out RaycastHit hit) && hit.transform == transform)
                OnPressed();
        }
    }

    void OnPressed()
    {
        // Visual feedback
        rend.material.color = pressedColor;
        transform.localScale = originalScale * pressedScale;

        // Open the URL
        Debug.Log(" Opening: " + url);
        Application.OpenURL(url);

        // Reset feedback after short delay
        Invoke(nameof(ResetFeedback), feedbackDuration);
    }

    void ResetFeedback()
    {
        rend.material.color = originalColor;
        transform.localScale = originalScale;
    }
}
